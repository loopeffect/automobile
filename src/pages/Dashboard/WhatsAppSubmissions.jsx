import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { whatsappAdminAPI } from '../../services/api';

const STATUS_COLORS = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  assigned: 'bg-blue-100 text-blue-700',
};

export default function WhatsAppSubmissions() {
  const [status, setStatus] = useState('pending');
  const [actionModal, setActionModal] = useState(null);
  const [dealerId, setDealerId] = useState('');
  const [note, setNote] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['wa-submissions', status],
    queryFn: () => whatsappAdminAPI.getSubmissions({ status }).then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, action, note: n, dealerId: d }) =>
      whatsappAdminAPI.reviewSubmission(id, { action, note: n, dealerId: d }),
    onSuccess: () => {
      toast.success('Submission updated');
      qc.invalidateQueries(['wa-submissions']);
      setActionModal(null);
      setDealerId('');
      setNote('');
    },
    onError: () => toast.error('Action failed'),
  });

  const submissions = data?.data || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-900">WhatsApp Submissions</h2>
        <div className="flex gap-2">
          {['pending', 'approved', 'assigned', 'rejected'].map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${
                status === s ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto mb-2 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-gray-500">No {status} submissions</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['From', 'Vehicle', 'Price', 'Phone', 'Submitted', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{sub.from?.replace('whatsapp:', '')}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">
                      {sub.vehicleData?.year} {sub.vehicleData?.make} {sub.vehicleData?.model}
                    </p>
                    {sub.vehicleData?.description && (
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{sub.vehicleData.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {sub.vehicleData?.price ? `${parseInt(sub.vehicleData.price).toLocaleString()} QAR` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{sub.vehicleData?.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[sub.status] || 'bg-gray-100 text-gray-500'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {sub.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => mutation.mutate({ id: sub._id, action: 'approve' })}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-2 py-1 rounded-lg transition-colors">
                          Approve
                        </button>
                        <button onClick={() => setActionModal({ type: 'assign', id: sub._id })}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-2 py-1 rounded-lg transition-colors">
                          Assign
                        </button>
                        <button onClick={() => mutation.mutate({ id: sub._id, action: 'reject' })}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-2 py-1 rounded-lg transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                    {sub.assignedDealer && (
                      <p className="text-xs text-gray-400">→ {sub.assignedDealer?.businessName}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {actionModal?.type === 'assign' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-bold text-gray-900">Assign to Dealer</h3>
            <div>
              <label className="text-sm font-medium text-gray-700">Dealer ID</label>
              <input value={dealerId} onChange={(e) => setDealerId(e.target.value)}
                placeholder="Paste dealer MongoDB ID"
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Admin Note (optional)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { if (!dealerId.trim()) return toast.error('Enter dealer ID'); mutation.mutate({ id: actionModal.id, action: 'assign', dealerId: dealerId.trim(), note }); }}
                disabled={mutation.isPending}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                {mutation.isPending ? 'Assigning…' : 'Assign & Create Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
