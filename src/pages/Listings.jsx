import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listingsAPI } from '../services/api';
import useStore from '../store/useStore';
import { ListingsGridSkeleton } from '../components/Skeleton';
import { buildDummyListings, filterAndPaginateDummy } from '../data/dummyListings';
import { motion } from 'framer-motion';
import Carousel from "../components/ShowcaseCarousel"

const BODY_TYPES = ['suv', 'sedan', 'hatchback', 'coupe', 'convertible', 'pickup', 'van', 'muv', 'luxury'];
const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid'];
const TRANSMISSIONS = ['automatic', 'manual', 'cvt'];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const gridContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const featureCards = [
  {
    title: 'Verified Inventory',
    text: 'Trusted dealers with structured listing quality.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Advanced Search',
    text: 'Fast multi-filter discovery optimized for mobile and desktop.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.5-4.5m0 0A7 7 0 105.5 5.5a7 7 0 0011 11z" />
      </svg>
    ),
  },
  {
    title: 'Secure Connect',
    text: 'Message dealers, request inspection, and track your buying flow.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const ListingCard = ({ listing }) => {
  const primary = listing.images?.find((i) => i.isPrimary) || listing.images?.[0];
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -8, scale: 1.012 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <Link
        to={`/listings/${listing._id}`}
        className="group bg-white border border-gray-200/90 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-300/40 transition-all duration-300 flex flex-col"
      >
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {primary ? (
            <img src={primary.thumbnail || primary.url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">No Image</div>
          )}
          {listing.isFeatured && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">Featured</span>
          )}
          {listing.images?.length > 0 && (
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-1-1H6.586l-1 1H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
              {listing.images.length}
            </span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-gray-500 mb-1 uppercase tracking-wide">{listing.year} • {listing.bodyType}</p>
            <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2">{listing.title}</h3>
            <p className="text-blue-700 font-bold text-base mt-2">{listing.price?.toLocaleString()} {listing.currency}</p>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-gray-500 text-xs">{listing.mileage?.toLocaleString()} {listing.mileageUnit}</span>
            <span className="text-gray-500 text-xs capitalize">{listing.fuelType}</span>
            {listing.dealer?.businessName && (
              <span className="text-gray-500 text-xs truncate max-w-[90px]">{listing.dealer.businessName}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Listings = () => {
  const { filters, setFilters, searchQuery, setSearchQuery, resetFilters } = useStore();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const params = { ...filters, q: searchQuery, page, limit: 12 };
  Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['listings', params],
    queryFn: async () => {
      const dummy = buildDummyListings();
      const useDummy = (p = params) => {
        const result = filterAndPaginateDummy(dummy, p);
        if (result.data.length === 0) {
          const firstPage = filterAndPaginateDummy(dummy, { page: 1, limit: params.limit || 12 });
          return { ...firstPage, showingSampleFallback: true };
        }
        return result;
      };
      try {
        const res = await listingsAPI.getAll(params);
        const apiData = res.data;
        if (!apiData?.data?.length) return useDummy();
        return apiData;
      } catch {
        const fallback = useDummy();
        return fallback;
      }
    },
    keepPreviousData: true,
  });

  const listings = data?.data || [];
  const pagination = data?.pagination;
  const usingDummy = Boolean(listings.length && listings[0]?._id?.startsWith?.('dummy-'));
  const showingSampleFallback = Boolean(data?.showingSampleFallback);

  const spotlightListings = useMemo(() => listings.filter((item) => item.images?.length).slice(0, 6), [listings]);

  const inventorySummary = useMemo(() => {
    if (!listings.length) return { avgPrice: 0, topBody: null, featured: 0 };
    const avgPrice = Math.round(listings.reduce((sum, item) => sum + (item.price || 0), 0) / listings.length);
    const bodyCount = listings.reduce((acc, item) => {
      if (!item.bodyType) return acc;
      acc[item.bodyType] = (acc[item.bodyType] || 0) + 1;
      return acc;
    }, {});
    const [topBody = null] = Object.entries(bodyCount).sort((a, b) => b[1] - a[1])[0] || [];
    const featured = listings.filter((item) => item.isFeatured).length;
    return { avgPrice, topBody, featured };
  }, [listings]);

  const topBodyTypes = useMemo(() => {
    const counts = listings.reduce((acc, item) => {
      if (!item.bodyType) return acc;
      acc[item.bodyType] = (acc[item.bodyType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [listings]);

  const inputClass = "bg-white border border-gray-300 text-gray-800 text-sm rounded-xl px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClass = "bg-white border border-gray-300 text-gray-700 text-sm rounded-xl px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  const applyQuickBodyType = (type) => {
    setFilters({ bodyType: type });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <section className="relative overflow-hidden py-12 px-4 sm:px-6 md:px-10 lg:px-16 border-b border-black/10 bg-[#080c14]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_36%)]" />
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <motion.div initial="hidden" animate="show" variants={gridContainer} className="relative z-10 max-w-7xl mx-auto">
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 text-blue-100 border border-white/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
            ALVIO Marketplace
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-white leading-tight max-w-3xl">
            Discover Your Next Car With
            <span className="text-blue-400"> premium search, rich media, and instant dealer connect.</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-blue-200/50 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.5-4.5m0 0A7 7 0 105.5 5.5a7 7 0 0011 11z" />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search make, model, keyword…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/45 focus:outline-none focus:border-blue-400"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors shadow-lg shadow-blue-900/30">
              {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </button>
          </motion.div>

          <motion.div variants={gridContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
            <motion.div variants={fadeUp} className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100/80 uppercase">Vehicles Live</p>
              <p className="text-2xl font-bold text-white mt-1">{pagination?.total || 0}</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100/80 uppercase">Avg Price</p>
              <p className="text-2xl font-bold text-white mt-1">{inventorySummary.avgPrice ? `${inventorySummary.avgPrice.toLocaleString()} QAR` : '—'}</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100/80 uppercase">Top Body</p>
              <p className="text-2xl font-bold text-white mt-1 capitalize">{inventorySummary.topBody || '—'}</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100/80 uppercase">Featured Cars</p>
              <p className="text-2xl font-bold text-white mt-1">{inventorySummary.featured}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {spotlightListings.length > 0 && (
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 pt-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={gridContainer} className="max-w-7xl mx-auto">
            <motion.div variants={fadeUp} className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Spotlight Gallery</h2>
              <Link to="/dealers" className="text-sm text-blue-700 hover:text-blue-800">View dealers →</Link>
            </motion.div>
            
            <motion.div variants={gridContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {spotlightListings.map((item) => {
                const image = item.images?.find((img) => img.isPrimary) || item.images?.[0];
                return (
                  <motion.div key={item._id} variants={fadeUp} whileHover={{ y: -6 }}>
                    <Link to={`/listings/${item._id}`} className="block relative rounded-2xl overflow-hidden border border-gray-200 group h-28 sm:h-32 shadow-sm hover:shadow-md transition-shadow">
                      <img src={image?.thumbnail || image?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                      <p className="absolute bottom-2 left-2 right-2 text-xs text-white/95 font-semibold truncate">{item.make} {item.model}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>
      )}<Carousel name="listing"/>

      <section className="px-4 sm:px-6 md:px-10 lg:px-16 pt-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={gridContainer} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          {featureCards.map((item) => (
            <motion.div key={item.title} variants={fadeUp} whileHover={{ y: -4 }} className="rounded-2xl p-4 border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">{item.icon}</div>
              <h3 className="text-gray-900 font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {showFilters && (
        <motion.section initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="px-4 sm:px-6 md:px-10 lg:px-16 pt-6">
          <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12m-9 8h6" /></svg>
              <p className="text-sm font-semibold">Refine Search</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <input {...{ className: inputClass, placeholder: 'Make', value: filters.make, onChange: (e) => setFilters({ make: e.target.value }) }} />
            <input {...{ className: inputClass, placeholder: 'Model', value: filters.model, onChange: (e) => setFilters({ model: e.target.value }) }} />
            <select className={selectClass} value={filters.bodyType} onChange={(e) => setFilters({ bodyType: e.target.value })}>
              <option value="">Body Type</option>
              {BODY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
            <select className={selectClass} value={filters.fuelType} onChange={(e) => setFilters({ fuelType: e.target.value })}>
              <option value="">Fuel</option>
              {FUEL_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
            <select className={selectClass} value={filters.transmission} onChange={(e) => setFilters({ transmission: e.target.value })}>
              <option value="">Transmission</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
            <input {...{ className: inputClass, placeholder: 'City', value: filters.city, onChange: (e) => setFilters({ city: e.target.value }) }} />
            <input {...{ className: inputClass, type: 'number', placeholder: 'Min Price', value: filters.minPrice, onChange: (e) => setFilters({ minPrice: e.target.value }) }} />
            <input {...{ className: inputClass, type: 'number', placeholder: 'Max Price', value: filters.maxPrice, onChange: (e) => setFilters({ maxPrice: e.target.value }) }} />
            <button onClick={resetFilters} className="col-span-2 sm:col-span-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl py-2 text-sm transition-colors">
              Reset
            </button>
          </div>
          </div>
        </motion.section>
      )}

      <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto">
        {usingDummy && (
          <div className="mb-4 px-4 py-2 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-sm">
            {showingSampleFallback
              ? 'No dealer listings match your filters. Showing sample listings.'
              : 'Showing demo listings (backend offline or no active listings). Your car images are loaded from the app.'}
          </div>
        )}
        {isLoading ? (
          <ListingsGridSkeleton count={8} />
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 rounded-2xl">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-lg font-medium text-gray-700">No listings found</p>
            <button onClick={resetFilters} className="mt-4 text-blue-700 hover:underline text-sm">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
              <p className="text-gray-700 text-sm">{pagination?.total} vehicle{pagination?.total !== 1 ? 's' : ''} found {isFetching && '(updating…)'} </p>
              <div className="flex gap-2 flex-wrap">
                {topBodyTypes.map(([type, count]) => (
                  <button
                    key={type}
                    onClick={() => applyQuickBodyType(type)}
                    className="text-xs rounded-full px-3 py-1.5 border border-gray-300 bg-white text-gray-700 capitalize hover:bg-gray-100 transition-colors"
                  >
                    {type} • {count}
                  </button>
                ))}
              </div>
            </div>

            <motion.div variants={gridContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
            </motion.div>

            {pagination?.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border border-gray-300 bg-white rounded-xl text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors">← Prev</button>
                <span className="text-sm text-gray-700">Page {page} of {pagination.totalPages}</span>
                <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border border-gray-300 bg-white rounded-xl text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors">Next →</button>
              </div>
            )}
           
          </>
        )}
        </div>
      </section>
    </div>
  );
};

export default Listings;
