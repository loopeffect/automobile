import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authAPI, inspectionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import ShowcaseCarousel from '../../components/ShowcaseCarousel';

const MotionDiv = motion.div;

const quickActions = [
  {
    label: 'Browse Cars',
    to: '/listings',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-5a2 2 0 011.9-1.37h10.2A2 2 0 0119 8l2 5M5 16h14M7 16v2m10-2v2M6 20h12" /></svg>,
  },
  {
    label: 'Messages',
    to: '/messages',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: 'My Orders',
    to: '/my-orders',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6m-7 3h8m-8 4h8m-8 4h5M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>,
  }
];

const BuyerDashboard = () => {
  const { user } = useAuth();

  const { data: savedListings = [] } = useQuery({
    queryKey: ['saved-listings', user?._id],
    queryFn: async () => {
      const { data } = await authAPI.getMe();
      return data.user?.savedListings || [];
    },
    enabled: !!user,
  });

  const { data: inspections = [] } = useQuery({
    queryKey: ['my-inspections'],
    queryFn: () => inspectionsAPI.getMy().then((r) => r.data.data),
  });

  const statusColors = { requested: 'bg-yellow-100 text-yellow-700', scheduled: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen bg-gray-50">
      <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-[#0b1630] px-4 sm:px-6 md:px-10 py-6">
        <h1 className="text-white text-2xl font-bold">My Account</h1>
        <p className="text-blue-200/60 text-sm mt-1">Welcome back, {user?.name}</p>
      </MotionDiv>

      <ShowcaseCarousel name="listing" />

      <div className="px-4 sm:px-6 md:px-10 py-8 space-y-8">
        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <MotionDiv key={a.label} whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
              <Link to={a.to} className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow text-center">
                <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">{a.icon}</span>
                <span className="text-sm font-medium text-gray-700">{a.label}</span>
              </Link>
            </MotionDiv>
          ))}
        </div>

        {/* Saved listings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Saved Listings ({savedListings.length})</h2>
            <Link to="/listings" className="text-blue-500 text-sm hover:underline">Browse more →</Link>
          </div>
          {savedListings.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No saved listings yet. <Link to="/listings" className="text-blue-500 hover:underline">Browse cars →</Link></div>
          ) : (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedListings.map((l) => {
                const img = l.images?.find((i) => i.isPrimary) || l.images?.[0];
                return (
                  <Link key={l._id || l} to={`/listings/${l._id || l}`} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 hover:bg-gray-50">
                    {img ? <img src={img.thumbnail || img.url} alt="" className="w-14 h-12 rounded object-cover flex-shrink-0" /> : <div className="w-14 h-12 rounded bg-gray-200 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{l.title || 'View listing'}</p>
                      {l.price && <p className="text-blue-600 text-sm font-bold">{l.price?.toLocaleString()} {l.currency}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Inspection requests */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">My Inspection Requests</h2>
          </div>
          {inspections.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No inspection requests yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inspections.map((insp) => (
                <div key={insp._id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{insp.listing?.make} {insp.listing?.model} {insp.listing?.year}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Requested {new Date(insp.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {insp.reportUrl && (
                      <a href={insp.reportUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">Download Report</a>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[insp.status] || 'bg-gray-100 text-gray-600'}`}>{insp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
