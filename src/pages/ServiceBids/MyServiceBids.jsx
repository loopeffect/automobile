import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { serviceBidsAPI } from '../../services/api';

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  accepted:  'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-700',
  countered: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-400',
};

const ServiceBidCard = ({ bid, onAction }) => {
  const img = bid.listing?.images?.[0];
  const isCountered = bid.status === 'countered';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-start gap-4">
        {img
          ? <img src={img.thumbnail || img.url} alt="" className="w-16 h-14 rounded-xl object-cover flex-shrink-0" />
          : <div className="w-16 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <Link to={`/listings/${bid.listing?._id}`} className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
            {bid.listing?.title || 'Vehicle'}
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">{bid.listing?.year} {bid.listing?.make} {bid.listing?.model}</p>
          <p className="text-xs text-gray-500 mt-1">Dealer: <span className="font-medium">{bid.dealer?.businessName}</span></p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[bid.status] || 'bg-gray-100 text-gray-500'}`}>
          {bid.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400">Service</p>
          <p className="font-medium text-gray-800 capitalize">{bid.serviceType}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400">Your Budget</p>
          <p className="font-semibold text-blue-600">{bid.bidAmount?.toLocaleString()} QAR</p>
        </div>
      </div>

      {bid.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{bid.description}</p>
      )}

      {/* Counter offer banner */}
      {isCountered && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-blue-700">Counter Offer Received</p>
          <p className="text-xl font-black text-blue-600">{bid.counterAmount?.toLocaleString()} QAR</p>
          {bid.counterNote && <p className="text-xs text-blue-500">{bid.counterNote}</p>}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onAction(bid._id, 'accept_counter')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => onAction(bid._id, 'reject_counter')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {bid.dealerNote && bid.status !== 'countered' && (
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-0.5">Dealer Note</p>
          <p className="text-sm text-gray-700">{bid.dealerNote}</p>
        </div>
      )}

      {bid.status === 'pending' && (
        <button
          onClick={() => onAction(bid._id, 'cancel')}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Cancel Request
        </button>
      )}
    </div>
  );
};

export default function MyServiceBids() {
  const qc = useQueryClient();

  const { data: bids = [], isLoading } = useQuery({
    queryKey: ['my-service-bids'],
    queryFn: () => serviceBidsAPI.getMy().then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, action }) => serviceBidsAPI.buyerAction(id, { action }),
    onSuccess: () => { toast.success('Updated'); qc.invalidateQueries(['my-service-bids']); },
    onError: () => toast.error('Action failed'),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Service Requests</h1>
      {bids.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3l3 3m-2.1-4.2a3 3 0 114.2 4.2l-8.5 8.5L7 19l1-4.3 8.6-8.4z" /></svg>
          </div>
          <p className="text-gray-500 font-medium">No service requests yet</p>
          <p className="text-sm text-gray-400 mt-1">Browse listings and request a service from a dealer</p>
          <Link to="/listings" className="mt-4 inline-block bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-blue-600 transition-colors">
            Browse Listings
          </Link>
        </div>
      ) : (
        bids.map((bid) => (
          <ServiceBidCard
            key={bid._id}
            bid={bid}
            onAction={(id, action) => mutation.mutate({ id, action })}
          />
        ))
      )}
    </div>
  );
}
