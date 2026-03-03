import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { listingsAPI, messagesAPI, inspectionsAPI, carOrdersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getDummyListingById } from '../data/dummyListings';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [message, setMessage] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const isDummy = id?.startsWith?.('dummy-');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: () =>
      isDummy
        ? Promise.resolve(getDummyListingById(id))
        : listingsAPI.getOne(id).then((r) => r.data.data),
  });

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await listingsAPI.toggleSave(id);
      toast.success('Saved!');
    } catch { toast.error('Failed to save'); }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!message.trim()) return;
    try {
      setSending(true);
      await messagesAPI.startConversation({
        recipientId: data?.dealer?.user?._id || data?.uploadedBy?._id,
        listingId: id,
        text: message,
      });
      toast.success('Message sent!');
      setShowContactForm(false);
      setMessage('');
      navigate('/messages');
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  const handleInspection = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await inspectionsAPI.request({ listingId: id });
      toast.success('Inspection requested!');
    } catch { toast.error('Failed to request inspection'); }
  };

  const handlePurchaseRequest = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      setPlacingOrder(true);
      await carOrdersAPI.create({ listingId: id, buyerMessage: orderMessage.trim() });
      toast.success('Purchase request sent to dealer');
      setShowOrderForm(false);
      setOrderMessage('');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send purchase request');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500">Listing not found</p>
        <Link to="/listings" className="text-blue-500 hover:underline">Back to listings</Link>
      </div>
    );
  }

  const images = data.images || [];
  const dealer = data.dealer;
  const whatsappNumber = dealer?.whatsapp?.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(`Hello ${dealer?.businessName || 'Dealer'}, I'm interested in ${data?.title}. Listing link: ${window.location.href}`);
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <Link to="/listings" className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm">
            ← Back to listings
          </Link>
          {isDummy && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Demo listing (backend offline)</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: images + details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200">
                {images.length > 0 ? (
                  <img src={images[activeImg]?.url} alt={data.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Images</div>
                )}
                {data.isFeatured && <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-blue-500' : 'border-transparent'}`}>
                      <img src={img.thumbnail || img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </MotionDiv>

            {/* Title + price */}
            <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">{data.title}</h1>
                  <p className="text-gray-400 text-sm mt-1">{data.year} • {data.mileage?.toLocaleString()} {data.mileageUnit} • {data.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 text-2xl font-bold">{data.price?.toLocaleString()} {data.currency}</p>
                  {data.isNegotiable && <span className="text-xs text-green-600 font-medium">Negotiable</span>}
                </div>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  ['Make', data.make], ['Model', data.model], ['Year', data.year],
                  ['Body', data.bodyType], ['Fuel', data.fuelType], ['Transmission', data.transmission],
                  ['Color', data.color], ['Doors', data.doors], ['Seats', data.seats],
                  ['Engine', data.engineSize], ['Drive', data.drivetrain], ['Horsepower', data.horsepower ? `${data.horsepower} hp` : null],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-gray-800 text-sm font-medium capitalize mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </MotionDiv>

            {/* Description */}
            {data.description && (
              <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-gray-900 font-bold text-lg mb-3">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{data.description}</p>
              </MotionDiv>
            )}

            {/* Features */}
            {data.features?.length > 0 && (
              <MotionDiv initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-gray-900 font-bold text-lg mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {data.features.map((f) => (
                    <span key={f} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </MotionDiv>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-4">
            {/* CTA buttons */}
            <MotionDiv whileHover={{ y: -3 }} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
              <button onClick={() => setShowContactForm(!showContactForm)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors">
                Contact Dealer
              </button>
              {showContactForm && (
                <form onSubmit={handleContact} className="space-y-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="I'm interested in this vehicle…"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" disabled={sending} className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
              <button onClick={handleSave} className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors text-sm">
                <span className="inline-flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12.1 20.3l-.1.1-.1-.1C7 16 4 13.3 4 9.9A3.9 3.9 0 017.9 6c1.5 0 2.9.7 3.8 1.8A5 5 0 0115.6 6 3.9 3.9 0 0119.5 10c0 3.3-3 6-7.4 10.3z" /></svg>
                  Save Listing
                </span>
              </button>
              {user?.role === 'buyer' && (
                <>
                  <button onClick={() => setShowOrderForm(!showOrderForm)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors text-sm">
                    Request To Purchase
                  </button>
                  {showOrderForm && (
                    <form onSubmit={handlePurchaseRequest} className="space-y-3">
                      <textarea
                        value={orderMessage}
                        onChange={(e) => setOrderMessage(e.target.value)}
                        placeholder="Optional note for dealer"
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button type="submit" disabled={placingOrder} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                        {placingOrder ? 'Sending…' : 'Send Purchase Request'}
                      </button>
                    </form>
                  )}
                 
                </>
              )}
            </MotionDiv>

            {/* Dealer card */}
            {dealer && (
              <MotionDiv whileHover={{ y: -3 }} className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-gray-900 font-bold mb-3">Dealer</h3>
                <div className="flex items-center gap-3 mb-3">
                  {dealer.logo ? (
                    <img src={dealer.logo} alt={dealer.businessName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {dealer.businessName?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{dealer.businessName}</p>
                    {dealer.isVerified && <span className="text-xs text-green-600 font-medium">Verified</span>}
                    {dealer.rating > 0 && <p className="text-xs text-yellow-500">Rating {dealer.rating.toFixed(1)} ({dealer.reviewCount})</p>}
                  </div>
                </div>
                {dealer.phone && <a href={`tel:${dealer.phone}`} className="block text-sm text-blue-500 hover:underline">{dealer.phone}</a>}
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noreferrer"
                    className="mt-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors w-full justify-center">
                    Contact On WhatsApp
                  </a>
                )}
                <Link to={`/dealers/${dealer._id}`} className="block text-center text-blue-500 hover:underline text-xs mt-3">
                  View dealer profile →
                </Link>
              </MotionDiv>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
