import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { carOrdersAPI } from '../services/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

export default function MyOrders() {
  const qc = useQueryClient();
  const [reviewDrafts, setReviewDrafts] = useState({});

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-car-orders'],
    queryFn: () => carOrdersAPI.getMy().then((r) => r.data.data),
  });

  const completeMutation = useMutation({
    mutationFn: (id) => carOrdersAPI.complete(id),
    onSuccess: () => {
      toast.success('Order marked as completed');
      qc.invalidateQueries(['my-car-orders']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to complete order'),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, rating, comment }) => carOrdersAPI.submitReview(id, { rating, comment }),
    onSuccess: () => {
      toast.success('Review submitted');
      qc.invalidateQueries(['my-car-orders']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit review'),
  });

  const updateDraft = (id, patch) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [id]: {
        rating: prev[id]?.rating || 5,
        comment: prev[id]?.comment || '',
        ...patch,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <p className="text-gray-500 text-sm">Track purchase requests, confirm completion, and review your dealer.</p>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6m-7 3h8m-8 4h8m-8 4h5M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
          </div>
          <p className="text-gray-500 font-medium">No orders yet</p>
          <p className="text-gray-400 text-sm mt-1">Purchase requests you send to dealers will appear here.</p>
          <Link to="/listings" className="inline-block mt-4 text-blue-500 hover:underline text-sm font-medium">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const img = order.listing?.images?.[0];
            const draft = reviewDrafts[order._id] || { rating: 5, comment: '' };
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {img ? (
                    <img src={img.thumbnail || img.url} alt="" className="w-full sm:w-24 h-20 sm:h-20 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-full sm:w-24 h-20 sm:h-20 rounded-xl bg-gray-200 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/listings/${order.listing?._id}`} className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
                      {order.listing?.title || 'Vehicle'}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{order.listing?.year} {order.listing?.make} {order.listing?.model}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.dealer?.businessName} · {order.listing?.price?.toLocaleString()} {order.listing?.currency || 'QAR'}
                    </p>
                    {order.buyerMessage && <p className="text-xs text-gray-500 mt-2">Your note: {order.buyerMessage}</p>}
                    {order.dealerNote && <p className="text-xs text-blue-700 mt-1">Dealer note: {order.dealerNote}</p>}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                    {order.status}
                  </span>
                </div>

                {order.status === 'accepted' && (
                  <button
                    onClick={() => completeMutation.mutate(order._id)}
                    disabled={completeMutation.isPending}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                  >
                    Confirm Car Received
                  </button>
                )}

                {order.status === 'completed' && !order.review && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-800">Leave a review for dealer</p>
                    <div>
                      <label className="text-xs text-gray-500">Rating</label>
                      <select
                        value={draft.rating}
                        onChange={(e) => updateDraft(order._id, { rating: Number(e.target.value) })}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>{r} / 5</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Comment</label>
                      <textarea
                        value={draft.comment}
                        onChange={(e) => updateDraft(order._id, { comment: e.target.value })}
                        rows={3}
                        placeholder="Share your experience with this dealer"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                      />
                    </div>
                    <button
                      onClick={() => reviewMutation.mutate({ id: order._id, rating: draft.rating, comment: draft.comment })}
                      disabled={reviewMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                )}

                {order.review && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                    Your review: {order.review.rating}/5 {order.review.comment ? `• ${order.review.comment}` : ''}
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
