import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const BidRow = ({ bid, onRespond }) => {
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState('');
  const [note, setNote] = useState('');
  const img = bid.listing?.images?.[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        {img
          ? <img src={img.thumbnail || img.url} alt="" className="w-14 h-12 rounded-lg object-cover flex-shrink-0" />
          : <div className="w-14 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 line-clamp-1">{bid.listing?.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            From: <span className="font-medium text-gray-600">{bid.buyer?.name}</span>
            {' · '}
            <span className="capitalize">{bid.serviceType}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-bold text-blue-600 text-sm">{bid.bidAmount?.toLocaleString()} QAR</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[bid.status] || 'bg-gray-100 text-gray-500'}`}>
            {bid.status}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 space-y-4 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Buyer</p>
              <p className="font-medium">{bid.buyer?.name}</p>
              <p className="text-xs text-gray-400">{bid.buyer?.email}</p>
              {bid.buyer?.phone && <p className="text-xs text-gray-400">{bid.buyer.phone}</p>}
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Budget</p>
              <p className="font-bold text-blue-600">{bid.bidAmount?.toLocaleString()} QAR</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Valid Until</p>
              <p className="font-medium">{bid.validUntil ? new Date(bid.validUntil).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Submitted</p>
              <p className="font-medium">{new Date(bid.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Description</p>
            <p className="text-sm text-gray-700">{bid.description}</p>
          </div>

          {bid.status === 'pending' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">Note to buyer (optional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                  placeholder="Add a note..."
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => onRespond(bid._id, 'accept', null, note)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                  Accept
                </button>
                <button onClick={() => onRespond(bid._id, 'reject', null, note)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                  Reject
                </button>
                <div className="flex gap-2 items-center">
                  <input
                    type="number" value={counter} onChange={(e) => setCounter(e.target.value)}
                    placeholder="Counter offer (QAR)"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-44 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={() => { if (!counter) return toast.error('Enter counter amount'); onRespond(bid._id, 'counter', Number(counter), note); }}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                    Counter
                  </button>
                </div>
              </div>
            </div>
          )}

          {bid.status === 'accepted' && (
            <button onClick={() => onRespond(bid._id, 'complete')}
              className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
              Mark as Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function DealerServiceBids() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const qc = useQueryClient();

  const { data: bids = [], isLoading } = useQuery({
    queryKey: ['dealer-service-bids', statusFilter],
    queryFn: () => serviceBidsAPI.getDealer({ status: statusFilter }).then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, action, counterAmount, dealerNote }) =>
      serviceBidsAPI.respond(id, { action, counterAmount, dealerNote }),
    onSuccess: () => { toast.success('Updated'); qc.invalidateQueries(['dealer-service-bids']); },
    onError: () => toast.error('Action failed'),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
        <div className="flex gap-2 flex-wrap">
          {['pending', 'accepted', 'countered', 'completed', 'rejected'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                statusFilter === s ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3l3 3m-2.1-4.2a3 3 0 114.2 4.2l-8.5 8.5L7 19l1-4.3 8.6-8.4z" /></svg>
          </div>
          <p className="text-gray-500 font-medium">No {statusFilter} service requests</p>
        </div>
      ) : (
        bids.map((bid) => (
          <BidRow
            key={bid._id}
            bid={bid}
            onRespond={(id, action, counterAmount, dealerNote) =>
              mutation.mutate({ id, action, counterAmount, dealerNote })
            }
          />
        ))
      )}
    </div>
  );
}
