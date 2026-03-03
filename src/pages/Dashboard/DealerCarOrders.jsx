import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { carOrdersAPI } from '../../services/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

export default function DealerCarOrders() {
  const [status, setStatus] = useState('pending');
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['dealer-car-orders', status],
    queryFn: () => carOrdersAPI.getDealer({ status }).then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, action, dealerNote }) => carOrdersAPI.respond(id, { action, dealerNote }),
    onSuccess: () => {
      toast.success('Order updated');
      qc.invalidateQueries(['dealer-car-orders']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-900">Car Purchase Orders</h2>
        <div className="flex gap-2 flex-wrap">
          {['pending', 'accepted', 'completed', 'rejected', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                status === s ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">No {status} orders</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const img = order.listing?.images?.[0];
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start gap-3 flex-wrap">
                  {img ? (
                    <img src={img.thumbnail || img.url} alt="" className="w-16 h-14 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-14 rounded-lg bg-gray-200" />
                  )}
                  <div className="flex-1 min-w-[220px]">
                    <p className="font-semibold text-gray-900">{order.listing?.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Buyer: {order.buyer?.name} {order.buyer?.phone ? `• ${order.buyer.phone}` : ''}
                    </p>
                    {order.buyerMessage && <p className="text-sm text-gray-600 mt-2">{order.buyerMessage}</p>}
                    {order.dealerNote && <p className="text-xs text-blue-700 mt-1">Dealer note: {order.dealerNote}</p>}
                    {order.review && (
                      <p className="text-xs text-amber-700 mt-1">Review: {order.review.rating}/5 {order.review.comment ? `• ${order.review.comment}` : ''}</p>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>

                {order.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => mutation.mutate({ id: order._id, action: 'accept' })}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => mutation.mutate({ id: order._id, action: 'reject' })}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
