import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { listingsAPI, serviceBidsAPI } from '../../services/api';

const SERVICE_TYPES = [
  { value: 'repair',       label: 'Repair',       icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3l3 3m-2.1-4.2a3 3 0 114.2 4.2l-8.5 8.5L7 19l1-4.3 8.6-8.4z" /></svg> },
  { value: 'maintenance',  label: 'Maintenance',  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 3l1.5 3.5L15 8l-3.5 1.5L10 13 8.5 9.5 5 8l3.5-1.5L10 3zM18 14l.8 1.8L21 16l-2.2.2L18 18l-.8-1.8L15 16l2.2-.2.8-1.8zM6 14l.8 1.8L9 16l-2.2.2L6 18l-.8-1.8L3 16l2.2-.2.8-1.8z" /></svg> },
  { value: 'inspection',   label: 'Inspection',   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.5-4.5m0 0A7 7 0 105.5 5.5a7 7 0 0011 11z" /></svg> },
  { value: 'detailing',    label: 'Detailing',    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" /></svg> },
  { value: 'modification', label: 'Modification', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 16l3.5-3.5m0 0L12 9m-3.5 3.5L5 9m3.5 3.5L12 16m7-9l-2 2m0 0l-2 2m2-2l2 2m-2-2l-2-2" /></svg> },
  { value: 'other',        label: 'Other',        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 12h8M8 17h5M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg> },
];

export default function RequestService() {
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');

  const { data: listingData, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => listingsAPI.get(listingId).then((r) => r.data.data),
  });

  const {
    register, handleSubmit, formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => serviceBidsAPI.create({ ...data, listingId, serviceType: selectedType }),
    onSuccess: () => {
      toast.success('Service request submitted!');
      navigate('/dashboard/buyer');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit'),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const listing = listingData;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Request a Service</h1>
          {listing && (
            <p className="text-gray-500 text-sm mt-1">For: <span className="font-medium text-gray-700">{listing.title}</span></p>
          )}
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">

          {/* Service Type */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Service Type <span className="text-red-500">*</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SERVICE_TYPES.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setSelectedType(st.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedType === st.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-current">{st.icon}</span>
                  {st.label}
                </button>
              ))}
            </div>
            {!selectedType && <p className="text-xs text-red-500 mt-2">Please select a service type</p>}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-900">Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Describe the service needed <span className="text-red-500">*</span></label>
              <textarea
                {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters' } })}
                rows={4}
                placeholder="Describe what you need in detail..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Budget (QAR) <span className="text-red-500">*</span></label>
                <input
                  {...register('bidAmount', { required: 'Budget is required', min: { value: 1, message: 'Must be > 0' } })}
                  type="number"
                  placeholder="e.g. 500"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {errors.bidAmount && <p className="text-xs text-red-500 mt-1">{errors.bidAmount.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input
                  {...register('validUntil')}
                  type="date"
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending || !selectedType}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {mutation.isPending ? 'Submitting…' : 'Submit Service Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
