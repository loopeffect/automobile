import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dealersAPI } from '../services/api';
import { ListingsGridSkeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';
import Carousel from '../components/ShowcaseCarousel';
const DealerCard = ({ dealer }) => (
  <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
    <Link
      to={`/dealers/${dealer._id}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-300/40 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-40 bg-[#0b1630] overflow-hidden">
        {dealer.coverImage ? (
          <img src={dealer.coverImage} alt="" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0f1d40]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
          <div className="w-14 h-14 rounded-xl bg-white border-2 border-white shadow-lg overflow-hidden flex-shrink-0">
            {dealer.logo ? (
              <img src={dealer.logo} alt={dealer.businessName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {dealer.businessName?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pb-0.5">
            <h3 className="text-white font-bold text-sm truncate drop-shadow-md">{dealer.businessName}</h3>
            {dealer.address?.city && <p className="text-blue-100/85 text-xs truncate">{dealer.address.city}</p>}
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {dealer.isVerified && <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Verified</span>}
          {dealer.isFeatured && <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">Featured</span>}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-gray-500 text-xs">{dealer.totalListings ?? 0} listings</span>
          {dealer.rating != null && <span className="text-gray-700 text-xs font-semibold">Rating {Number(dealer.rating).toFixed(1)}</span>}
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function Dealers() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const limit = 12;

  const params = { page, limit };
  if (searchQuery) params.q = searchQuery;
  if (city) params.city = city;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['dealers', params],
    queryFn: () => dealersAPI.getAll(params).then((r) => r.data),
    keepPreviousData: true,
  });

  const dealers = data?.data || [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden bg-[#080c14] py-10 px-4 sm:px-6 md:px-10 lg:px-16 border-b border-black/10"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_36%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-4">Dealers</h1>
          <p className="text-blue-100/80 text-sm mb-4">Find verified dealers and browse their inventory</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dealer name…"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="sm:w-40 bg-white/10 border border-white/20 text-white placeholder-white/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </motion.div>
      <Carousel name="ads"/>

      <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 max-w-7xl mx-auto">
        {isLoading ? (
          <ListingsGridSkeleton count={8} />
        ) : dealers.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 rounded-2xl">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-lg font-medium text-gray-700">No dealers found</p>
          </div>
        ) : (
          <>
            <p className="text-gray-700 text-sm mb-5">{total} dealer{total !== 1 ? 's' : ''} found {isFetching && '(updating…)'} </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {dealers.map((d) => (
                <DealerCard key={d._id} dealer={d} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border border-gray-300 bg-white rounded-xl text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-gray-300 bg-white rounded-xl text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
