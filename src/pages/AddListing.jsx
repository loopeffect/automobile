import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { listingsAPI } from '../services/api';

const schema = z.object({
  title: z.string().min(5, 'Title too short'),
  make: z.string().min(1, 'Make required'),
  model: z.string().min(1, 'Model required'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(1, 'Price required'),
  mileage: z.coerce.number().min(0).default(0),
  bodyType: z.string().min(1, 'Body type required'),
  fuelType: z.string().min(1, 'Fuel type required'),
  transmission: z.string().min(1),
  condition: z.string().min(1),
  color: z.string().optional(),
  description: z.string().optional(),
  isNegotiable: z.boolean().default(false),
});

const FIELD_CLASS = "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-1.5";

const AddListing = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { condition: 'used', transmission: 'automatic', fuelType: 'petrol', bodyType: 'sedan' },
  });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v); });
      images.forEach((img) => fd.append('images', img));
      await listingsAPI.create(fd);
      toast.success('Listing created successfully!');
      navigate('/dashboard/dealer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  const sectionClass = "bg-white rounded-2xl p-6 shadow-sm space-y-5";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0b1630] px-4 sm:px-6 md:px-10 py-6">
        <h1 className="text-white text-2xl font-bold">Add New Listing</h1>
        <p className="text-blue-200/60 text-sm mt-1">Fill in the vehicle details below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Basic info */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Vehicle Information</h2>
          <div>
            <label className={LABEL_CLASS}>Listing Title</label>
            <input {...register('title')} placeholder="e.g. 2020 Toyota Camry XSE – Excellent Condition" className={FIELD_CLASS} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={LABEL_CLASS}>Make</label>
              <input {...register('make')} placeholder="Toyota" className={FIELD_CLASS} />
              {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
            </div>
            <div>
              <label className={LABEL_CLASS}>Model</label>
              <input {...register('model')} placeholder="Camry" className={FIELD_CLASS} />
              {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
            </div>
            <div>
              <label className={LABEL_CLASS}>Year</label>
              <input {...register('year')} type="number" placeholder="2020" className={FIELD_CLASS} />
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
              <input {...register('mileage')} type="number" placeholder="0" className={FIELD_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Color</label>
              <input {...register('color')} placeholder="White" className={FIELD_CLASS} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Price (QAR)</label>
              <input {...register('price')} type="number" placeholder="50000" className={FIELD_CLASS} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div className="flex items-center gap-3 self-end pb-1">
              <input {...register('isNegotiable')} type="checkbox" id="negotiable" className="w-4 h-4 rounded border-gray-300 text-blue-500" />
              <label htmlFor="negotiable" className="text-sm text-gray-700">Price is negotiable</label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Description</h2>
          <textarea {...register('description')} rows={5} placeholder="Describe the vehicle's condition, history, features…" className={FIELD_CLASS + ' resize-none'} />
        </div>

        {/* Images */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Photos</h2>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <svg className="w-10 h-10 text-blue-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-blue-500 font-medium text-sm">Click to upload photos</p>
              <p className="text-gray-400 text-xs mt-1">Up to 20 images • JPG, PNG, WebP • Max 10MB each</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImages} className="sr-only" />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
              {previews.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">Primary</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="flex-2 flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            {submitting ? 'Submitting…' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListing;
