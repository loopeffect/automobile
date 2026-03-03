import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingsAPI, dealersAPI } from '../../services/api';
import DealerAnalytics from './DealerAnalytics';
import DealerServiceBids from '../ServiceBids/DealerServiceBids';
import DealerCarOrders from './DealerCarOrders';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ShowcaseCarousel from '../../components/ShowcaseCarousel';

const MotionDiv = motion.div;

const StatusBadge = ({ status }) => {
  const colors = { active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700', draft: 'bg-gray-100 text-gray-600', sold: 'bg-blue-100 text-blue-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const DealerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('analytics');
  const [whatsappInput, setWhatsappInput] = useState('');

  const { data: listings = [], isLoading: loadingListings } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => listingsAPI.getMy().then((r) => r.data.data),
  });

  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['dealer-analytics'],
    queryFn: () => dealersAPI.getMyAnalytics().then((r) => r.data.data),
  });

  const { data: dealerProfile } = useQuery({
    queryKey: ['dealer-profile'],
    queryFn: () => dealersAPI.getMyProfile().then((r) => r.data.data),
  });

  const updateWhatsAppMutation = useMutation({
    mutationFn: (whatsapp) => dealersAPI.updateMyProfile({ whatsapp }),
    onSuccess: () => {
      toast.success('WhatsApp number updated');
      qc.invalidateQueries(['dealer-profile']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update WhatsApp number'),
  });

  const normalizedRating = analytics?.dealer?.rating ?? analytics?.rating ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-gradient-to-r from-[#0b1630] to-[#123066] px-4 sm:px-6 md:px-10 py-7 border-b border-blue-900/40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-white text-3xl font-black tracking-tight">{dealerProfile?.businessName || 'Dealer Dashboard'}</h1>
            <p className="text-blue-200/70 text-sm mt-1">Performance, inventory, and customer activity in one place</p>
            {dealerProfile?.isVerified && <span className="text-green-400 text-xs mt-1 inline-block">Verified Dealer</span>}
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-red-500/90 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="flex gap-2 mt-5 overflow-x-auto">
          {['listings', 'analytics', 'orders', 'services', 'profile'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-colors ${tab === t ? 'bg-white text-[#123066]' : 'bg-white/10 text-blue-100/80 hover:bg-white/20 hover:text-white'}`}>{t}</button>
          ))}
        </div>
      </MotionDiv>

      <ShowcaseCarousel name="dealer" />

      <div className="px-4 sm:px-6 md:px-10 py-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Active Listings</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{loadingAnalytics ? '…' : ((analytics?.totals?.active ?? analytics?.totalListings) ?? 0)}</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Views</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{loadingAnalytics ? '…' : (((analytics?.totals?.totalViews ?? analytics?.totalViews) ?? 0).toLocaleString())}</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Inquiries</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{loadingAnalytics ? '…' : (((analytics?.totals?.totalInquiries ?? analytics?.totalInquiries) ?? 0).toLocaleString())}</p>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Rating</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{loadingAnalytics ? '…' : (normalizedRating != null ? `${Number(normalizedRating).toFixed(1)} / 5` : 'No reviews')}</p>
          </div>
        </div>

        {tab === 'listings' && (
          <div>
            {/* Status filter tabs */}
            <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-bold text-gray-900">My Listings</h2>
                <Link to="/listings/add" className="text-blue-500 text-sm hover:underline">+ Add new</Link>
              </div>
              {loadingListings ? (
                <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : listings.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm">No listings yet.</p>
                  <Link to="/listings/add" className="mt-3 inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-600">Create Your First Listing</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {['Vehicle', 'Price', 'Status', 'Views', 'Saves', 'Actions'].map((h) => (
                          <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-4 py-3 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((l) => {
                        const img = l.images?.find((i) => i.isPrimary) || l.images?.[0];
                        return (
                          <tr key={l._id} className="hover:bg-blue-50/40 transition-colors border-t border-gray-100">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {img ? <img src={img.thumbnail || img.url} alt="" className="w-12 h-10 rounded object-cover flex-shrink-0" /> : <div className="w-12 h-10 rounded bg-gray-200 flex-shrink-0" />}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{l.title}</p>
                                  <p className="text-xs text-gray-400">{l.year} • {l.make}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-blue-600">{l.price?.toLocaleString()} {l.currency}</td>
                            <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                            <td className="px-4 py-3 text-sm text-gray-500">{l.views}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{l.saves}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Link to={`/listings/${l._id}`} className="text-xs text-blue-500 hover:underline">View</Link>
                                <Link to={`/listings/${l._id}/edit`} className="text-xs text-gray-500 hover:underline">Edit</Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </MotionDiv>
          </div>
        )}

        {tab === 'analytics' && <DealerAnalytics />}
        {tab === 'orders' && <DealerCarOrders />}
        {tab === 'services' && <DealerServiceBids />}

        {tab === 'profile' && dealerProfile && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Dealer Profile</h2>
              {[
                ['Business Name', dealerProfile.businessName],
                ['Email', dealerProfile.email],
                ['Phone', dealerProfile.phone],
                ['WhatsApp', dealerProfile.whatsapp],
                ['Website', dealerProfile.website],
                ['City', dealerProfile.address?.city],
              ].map(([label, value]) => value && (
                <div key={label} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-gray-800">{value}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Update WhatsApp Number</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    placeholder={dealerProfile.whatsapp || '+974 XXXXXXXX'}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => updateWhatsAppMutation.mutate(whatsappInput.trim())}
                    disabled={updateWhatsAppMutation.isPending || !whatsappInput.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Save
                  </button>
                </div>
                <p className="text-xs text-gray-500">This number will be used for the "Contact On WhatsApp" button on your listings.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerDashboard;
