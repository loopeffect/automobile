import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { serviceBidsAPI } from '../../services/api';

export default function ServiceOrderConfirm() {
  const { bidId } = useParams();
  const qc = useQueryClient();

  const { data: bid, isLoading, error } = useQuery({
    queryKey: ['service-bid', bidId],
    queryFn: () => serviceBidsAPI.getOne(bidId).then((r) => r.data.data),
    enabled: !!bidId,
  });

  const confirmOrderMutation = useMutation({
    mutationFn: () => serviceBidsAPI.confirmOrder(bidId),
    onSuccess: () => {
      toast.success('Order confirmed');
      qc.invalidateQueries(['service-bid', bidId]);
      qc.invalidateQueries(['my-service-bids']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to confirm order'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 font-medium">Order not found or you do not have access.</p>
        <Link to="/my-orders" className="mt-4 inline-block text-blue-500 hover:underline">Back to My Orders</Link>
      </div>
    );
  }

  const isAcceptedOrCompleted = bid.status === 'accepted' || bid.status === 'completed';
  const isBuyer = bid.buyer && typeof bid.buyer === 'object';
  const canConfirm = isAcceptedOrCompleted && isBuyer && !bid.orderConfirmedByBuyerAt;
  const amount = bid.counterAmount ?? bid.bidAmount;
  const img = bid.listing?.images?.[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/my-orders" className="text-blue-500 hover:underline text-sm font-medium mb-6 inline-block">My Orders</Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#0b1630] px-5 py-4">
          <h1 className="text-white text-xl font-bold">Order details</h1>
          <p className="text-blue-200/60 text-sm mt-0.5">
            {bid.status === 'completed' ? 'Completed' : bid.orderConfirmedByBuyerAt ? 'Order confirmed' : 'Confirm your purchase'}
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex gap-4">
            {img ? (
              <img src={img.thumbnail || img.url} alt="" className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-24 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
            )}
            <div>
              <Link to={`/listings/${bid.listing?._id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                {bid.listing?.title || `${bid.listing?.year} ${bid.listing?.make} ${bid.listing?.model}`}
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">
                {bid.listing?.mileage != null && `${bid.listing.mileage?.toLocaleString()} ${bid.listing.mileageUnit || 'km'}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Service</p>
              <p className="font-medium text-gray-800 capitalize">{bid.serviceType}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Amount</p>
              <p className="font-bold text-blue-600">{amount?.toLocaleString()} {bid.currency || 'QAR'}</p>
            </div>
          </div>

          {bid.description && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Request details</p>
              <p className="text-sm text-gray-700">{bid.description}</p>
            </div>
          )}

          {bid.dealer && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-2">Dealer</p>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {bid.dealer.logo ? (
                    <img src={bid.dealer.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-bold flex items-center justify-center">{bid.dealer.businessName?.[0]}</div>
                  )}
                  <div>
                    <Link to={`/dealers/${bid.dealer._id}`} className="font-medium text-gray-900 hover:text-blue-600">{bid.dealer.businessName}</Link>
                    {bid.dealer.address?.city && <p className="text-xs text-gray-500">{bid.dealer.address.city}</p>}
                  </div>
                </div>
                {bid.dealer.whatsapp && (
                  <a
                    href={`https://wa.me/${bid.dealer.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors whitespace-nowrap"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}

          {canConfirm && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium mb-3">Confirm this order to proceed. The dealer will contact you for payment and scheduling.</p>
              <button
                onClick={() => confirmOrderMutation.mutate()}
                disabled={confirmOrderMutation.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {confirmOrderMutation.isPending ? 'Confirming…' : 'Confirm purchase'}
              </button>
            </div>
          )}

          {bid.orderConfirmedByBuyerAt && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-800 font-semibold">Order confirmed</p>
              <p className="text-green-600 text-sm mt-0.5">
                Confirmed on {new Date(bid.orderConfirmedByBuyerAt).toLocaleDateString()}. The dealer will reach out for next steps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
