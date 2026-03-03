import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dealersAPI } from '../services/api';

const DealerProfile = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['dealer', id],
    queryFn: () => dealersAPI.getOne(id).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Dealer not found</div>;
  }

  const { dealer, listings } = data;
  const waNumber = dealer?.whatsapp?.replace(/\D/g, '');
  const waText = encodeURIComponent(`Hello ${dealer?.businessName || 'Dealer'}, I found your profile on ALVIO and want to discuss a car purchase.`);
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="relative h-48 sm:h-64 bg-[#0b1630]">
        {dealer.coverImage && <img src={dealer.coverImage} alt="cover" className="w-full h-full object-cover opacity-50" />}
      </div>

      {/* Profile header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end gap-5 -mt-14 mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
            {dealer.logo ? (
              <img src={dealer.logo} alt={dealer.businessName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                {dealer.businessName?.[0]}
              </div>
            )}
          </div>
          <div className="pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">{dealer.businessName}</h1>
              {dealer.isVerified && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Verified</span>}
              {dealer.isFeatured && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>}
            </div>
            {dealer.address?.city && <p className="text-gray-500 text-sm mt-0.5">{dealer.address.city}</p>}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
          {[
            ['Listings', dealer.totalListings],
            ['Sold', dealer.soldListings],
            ['Rating', dealer.rating ? `${dealer.rating.toFixed(1)}/5` : 'N/A'],
            ['Reviews', dealer.reviewCount],
          ].map(([label, val]) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Listings */}
          <div className="lg:col-span-2">
            <h2 className="text-gray-900 font-bold text-lg mb-4">Active Listings</h2>
            {listings?.length === 0 ? (
              <p className="text-gray-400 text-sm">No listings available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings?.map((listing) => {
                  const img = listing.images?.find((i) => i.isPrimary) || listing.images?.[0];
                  return (
                    <Link key={listing._id} to={`/listings/${listing._id}`} className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="h-36 bg-gray-100 overflow-hidden">
                        {img ? <img src={img.thumbnail || img.url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>}
                      </div>
                      <div className="p-3">
                        <h3 className="text-gray-800 font-semibold text-sm line-clamp-1">{listing.title}</h3>
                        <p className="text-blue-600 font-bold text-sm mt-1">{listing.price?.toLocaleString()} {listing.currency}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact card */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="text-gray-900 font-bold">Contact Info</h2>
              {dealer.phone && (
                <a href={`tel:${dealer.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-500">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.2a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.2 1.1a11 11 0 005.5 5.5l1.1-2.2a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" /></svg> {dealer.phone}
                </a>
              )}
              {dealer.email && (
                <a href={`mailto:${dealer.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-500">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" /></svg> {dealer.email}
                </a>
              )}
              {dealer.address?.street && (
                <p className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg> {dealer.address.street}, {dealer.address.city}
                </p>
              )}
              {waHref && (
                <a href={waHref} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors text-sm">
                  Contact On WhatsApp
                </a>
              )}
              {dealer.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 leading-relaxed">{dealer.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerProfile;
