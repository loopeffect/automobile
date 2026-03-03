import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AuthBackgroundSlider from '../../components/AuthBackgroundSlider';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['buyer', 'dealer']),
  businessName: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'buyer' },
  });

  const role = watch('role');

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      const user = await registerUser(values);
      toast.success(`Account created! Welcome, ${user.name}`);
      if (user.role === 'dealer') navigate('/dashboard/dealer');
      else navigate('/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#0b1630] border border-blue-900/50 text-white placeholder-blue-200/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <AuthBackgroundSlider />
      <div className="absolute inset-0 bg-gradient-to-br from-[#050810]/85 via-[#0b1630]/75 to-[#050810]/90" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img src="/alvio-logo.png" alt="ALVIO" className="h-10 w-auto" />
        </div>

        <div className="bg-[#0f1d40]/85 backdrop-blur-md border border-blue-900/50 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-white text-2xl font-bold mb-1">Create account</h1>
          <p className="text-blue-200/60 text-sm mb-7">Join ALVIO Automotive Marketplace</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              {['buyer', 'dealer'].map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${role === r ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-blue-900/50 text-blue-200/50 hover:border-blue-700'}`}
                >
                  <input {...register('role')} type="radio" value={r} className="sr-only" />
                  <span className="text-sm font-medium capitalize">{r}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm text-blue-200/80 mb-1.5">Full Name</label>
              <input {...register('name')} placeholder="John Doe" className={inputClass} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-blue-200/80 mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className={inputClass} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-blue-200/80 mb-1.5">Phone (optional)</label>
              <input {...register('phone')} placeholder="+974 XX XXX XXXX" className={inputClass} />
            </div>

            {role === 'dealer' && (
              <>
                <div>
                  <label className="block text-sm text-blue-200/80 mb-1.5">Business Name</label>
                  <input {...register('businessName')} placeholder="Your Dealership" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-blue-200/80 mb-1.5">WhatsApp Number (optional)</label>
                  <input {...register('whatsapp')} placeholder="+974 XXXXXXXX" className={inputClass} />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-blue-200/80 mb-1.5">Password</label>
              <input {...register('password')} type="password" placeholder="Min 6 characters" className={inputClass} />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-blue-200/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
