import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { listingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  title: z.string().min(5, 'Title too short'),
  make: z.string().min(1, 'Make required'),
  model: z.string().min(1, 'Model required'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(1, 'Price required'),
  mileage: z.coerce.number().min(0).default(0),
  bodyType: z.string().min(1),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  condition: z.string().min(1),
  color: z.string().optional(),
  description: z.string().optional(),
  isNegotiable: z.boolean().default(false),
  status: z.string().optional(),
});

const FIELD_CLASS = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1.5';

const EditListing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsAPI.getOne(id).then((r) => r.data.data),
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(schema),
  });

  // Populate form once listing loads
  useEffect(() => {
    if (listing) {
      reset({
        title: listing.title,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        mileage: listing.mileage,
        bodyType: listing.bodyType,
        fuelType: listing.fuelType,
        transmission: listing.transmission,
        condition: listing.condition,
        color: listing.color || '',
        description: listing.description || '',
        isNegotiable: listing.isNegotiable,
        status: listing.status,
      });
    }
  }, [listing, reset]);

  const updateMutation = useMutation({
    mutationFn: (fd) => listingsAPI.update(id, fd),
    onSuccess: () => {
      toast.success('Listing updated successfully');
      qc.invalidateQueries(['listing', id]);
      qc.invalidateQueries(['my-listings']);
      navigate(`/listings/${id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const toggleRemoveExisting = (url) => {
    setRemovedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const onSubmit = (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== '') fd.append(k, v);
    });

    // Pass removed image URLs so backend can strip them
    if (removedImages.length) {
      fd.append('removedImages', JSON.stringify(removedImages));
    }

    newImages.forEach((img) => fd.append('images', img));
    updateMutation.mutate(fd);
  };

  // Guard: only owner or admin can edit
  useEffect(() => {
    if (listing && user) {
      const isOwner =
        user.role === 'admin' ||
        String(listing.uploadedBy?._id || listing.uploadedBy) === String(user._id);
      if (!isOwner) {
        toast.error('You are not authorized to edit this listing');
        navigate('/listings');
      }
    }
  }, [listing, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Listing not found</p>
        <Link to="/listings" className="text-blue-500 hover:underline text-sm">Back to listings</Link>
      </div>
    );
  }

  const sectionClass = 'bg-white rounded-2xl p-6 shadow-sm space-y-5';
  const existingImages = listing.images?.filter((img) => !removedImages.includes(img.url)) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0b1630] px-4 sm:px-6 md:px-10 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-white text-2xl font-bold">Edit Listing</h1>
            <p className="text-blue-200/60 text-sm mt-1 truncate max-w-lg">{listing.title}</p>
          </div>
          {/* Status badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            listing.status === 'active' ? 'bg-green-500/20 text-green-400' :
            listing.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            listing.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {listing.status}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Rejection reason warning */}
        {listing.status === 'rejected' && listing.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <div>
              <p className="text-red-700 font-semibold text-sm">This listing was rejected</p>
              <p className="text-red-600 text-xs mt-0.5">{listing.rejectionReason}</p>
              <p className="text-red-500 text-xs mt-1">Fix the issues below and resubmit for review.</p>
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Vehicle Information</h2>
          <div>
            <label className={LABEL_CLASS}>Listing Title</label>
            <input {...register('title')} className={FIELD_CLASS} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={LABEL_CLASS}>Make</label>
              <input {...register('make')} className={FIELD_CLASS} />
              {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
            </div>
            <div>
              <label className={LABEL_CLASS}>Model</label>
              <input {...register('model')} className={FIELD_CLASS} />
              {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
            </div>
            <div>
              <label className={LABEL_CLASS}>Year</label>
              <input {...register('year')} type="number" className={FIELD_CLASS} />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Body Type', name: 'bodyType', options: ['suv','sedan','hatchback','coupe','pickup','van','muv','luxury','convertible'] },
              { label: 'Fuel Type', name: 'fuelType', options: ['petrol','diesel','electric','hybrid','plug-in-hybrid'] },
              { label: 'Transmission', name: 'transmission', options: ['automatic','manual','cvt'] },
              { label: 'Condition', name: 'condition', options: ['used','new','certified-pre-owned'] },
            ].map(({ label, name, options }) => (
              <div key={name}>
                <label className={LABEL_CLASS}>{label}</label>
                <select {...register(name)} className={FIELD_CLASS}>
                  {options.map((o) => <option key={o} value={o} className="capitalize">{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className={LABEL_CLASS}>Mileage (km)</label>
              <input {...register('mileage')} type="number" className={FIELD_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Color</label>
              <input {...register('color')} className={FIELD_CLASS} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Price (QAR)</label>
              <input {...register('price')} type="number" className={FIELD_CLASS} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div className="flex items-center gap-3 self-end pb-1">
              <input {...register('isNegotiable')} type="checkbox" id="negotiable" className="w-4 h-4 rounded" />
              <label htmlFor="negotiable" className="text-sm text-gray-700">Price is negotiable</label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Description</h2>
          <textarea {...register('description')} rows={5} className={FIELD_CLASS + ' resize-none'} />
        </div>

        {/* Admin status override */}
        {user?.role === 'admin' && (
          <div className={sectionClass}>
            <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Admin Controls</h2>
            <div>
              <label className={LABEL_CLASS}>Listing Status</label>
              <select {...register('status')} className={FIELD_CLASS}>
                {['active', 'pending', 'rejected', 'archived', 'sold'].map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Existing images */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
            Current Photos
            <span className="text-sm font-normal text-gray-400 ml-2">({existingImages.length} remaining)</span>
          </h2>

          {listing.images?.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {listing.images.map((img) => {
                const isRemoved = removedImages.includes(img.url);
                return (
                  <div key={img.url} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={img.thumbnail || img.url} alt="" className={`w-full h-full object-cover transition-opacity ${isRemoved ? 'opacity-30' : ''}`} />
                    {img.isPrimary && !isRemoved && (
                      <span className="absolute top-1 left-1 bg-blue-500 text-white text-[9px] font-bold px-1 rounded">Primary</span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleRemoveExisting(img.url)}
                      className={`absolute inset-0 flex items-center justify-center transition-colors ${
                        isRemoved
                          ? 'bg-red-500/40'
                          : 'bg-black/0 group-hover:bg-black/40'
                      }`}
                    >
                      {isRemoved ? (
                        <span className="text-white text-xs font-bold bg-red-500 px-2 py-0.5 rounded">Removed</span>
                      ) : (
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No existing photos.</p>
          )}
        </div>

        {/* Add new images */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Add More Photos</h2>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <svg className="w-8 h-8 text-blue-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-blue-500 font-medium text-sm">Click to upload additional photos</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP · Max 10MB each</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleNewImages} className="sr-only" />
          </label>
          {newPreviews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
              {newPreviews.map((p, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
          <button type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">
          {user?.role !== 'admin'
            ? 'Saving will resubmit the listing for admin review.'
            : 'Changes saved by admin go live immediately.'}
        </p>
      </form>
    </div>
  );
};

export default EditListing;
