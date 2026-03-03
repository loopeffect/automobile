import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { GuestRoute } from './router/ProtectedRoute';
import MarketplaceLayout from './components/MarketplaceLayout';
import DarkMotionShell from './components/DarkMotionShell';
import { usePushNotifications } from './hooks/usePushNotifications';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import DealerProfile from './pages/DealerProfile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Messages from './pages/Messages';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import DealerDashboard from './pages/Dashboard/DealerDashboard';
import BuyerDashboard from './pages/Dashboard/BuyerDashboard';
import RequestService from './pages/ServiceBids/RequestService';
import MyServiceBids from './pages/ServiceBids/MyServiceBids';
import DealerServiceBids from './pages/ServiceBids/DealerServiceBids';
import ServiceOrderConfirm from './pages/ServiceBids/ServiceOrderConfirm';
import WhatsAppSubmissions from './pages/Dashboard/WhatsAppSubmissions';
import Dealers from './pages/Dealers';
import MyOrders from './pages/MyOrders';
import BrandGuidelines from './pages/BrandGuidelines';
import Features from './pages/landing/Features';
import Technology from './pages/landing/Technology';
import Models from './pages/landing/Models';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

/** Wraps a page with MarketplaceLayout */
const ML = ({ children }) => <MarketplaceLayout>{children}</MarketplaceLayout>;
const DM = ({ children }) => <DarkMotionShell>{children}</DarkMotionShell>;

/** Inner component that can use auth context hooks */
const AppInner = () => {
  usePushNotifications();
  return null;
};

function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppInner />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#0f1d40', color: '#fff', border: '1px solid #1e3056' },
              success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* ── Landing pages (own Navbar/Footer, dark theme) ── */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/models" element={<Models />} />

            {/* ── Auth (no layout) ── */}
            <Route path="/login"    element={<GuestRoute><DM><Login /></DM></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><DM><Register /></DM></GuestRoute>} />

            {/* ── Public marketplace pages ── */}
            <Route path="/listing"      element={<ML><Listings /></ML>} />
            <Route path="/listing/:id"  element={<ML><ListingDetail /></ML>} />
            <Route path="/listings"     element={<ML><Listings /></ML>} />
            <Route path="/listings/:id" element={<ML><ListingDetail /></ML>} />
            <Route path="/dealers"      element={<ML><Dealers /></ML>} />
            <Route path="/dealers/:id"  element={<ML><DealerProfile /></ML>} />

            {/* ── Authenticated marketplace pages ── */}
            <Route path="/messages" element={
              <ProtectedRoute>
                <ML><Messages /></ML>
              </ProtectedRoute>
            } />

            {/* ── Dealer / Admin only ── */}
            <Route path="/listings/add" element={
              <ProtectedRoute roles={['dealer', 'admin']}>
                <ML><AddListing /></ML>
              </ProtectedRoute>
            } />
            <Route path="/listings/:id/edit" element={
              <ProtectedRoute roles={['dealer', 'admin']}>
                <ML><EditListing /></ML>
              </ProtectedRoute>
            } />

            {/* ── Service Bids ── */}
            <Route path="/listings/:id/request-service" element={
              <ProtectedRoute roles={['buyer']}>
                <ML><RequestService /></ML>
              </ProtectedRoute>
            } />
            <Route path="/my-service-requests" element={
              <ProtectedRoute roles={['buyer']}>
                <ML><MyServiceBids /></ML>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/dealer/service-bids" element={
              <ProtectedRoute roles={['dealer', 'admin']}>
                <DM><DealerServiceBids /></DM>
              </ProtectedRoute>
            } />

            {/* ── Orders (buyer direct purchase flow) ── */}
            <Route path="/my-orders" element={
              <ProtectedRoute roles={['buyer']}>
                <ML><MyOrders /></ML>
              </ProtectedRoute>
            } />
            <Route path="/order/:bidId" element={
              <ProtectedRoute roles={['buyer']}>
                <ML><ServiceOrderConfirm /></ML>
              </ProtectedRoute>
            } />

            {/* ── Brand / guidelines ── */}
            <Route path="/brand" element={<ML><BrandGuidelines /></ML>} />

            {/* ── Dashboards (no outer MarketplaceLayout — each dashboard has its own header) ── */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute roles={['admin']}><DM><AdminDashboard /></DM></ProtectedRoute>
            } />
            <Route path="/dashboard/dealer" element={
              <ProtectedRoute roles={['dealer']}><DM><DealerDashboard /></DM></ProtectedRoute>
            } />
            <Route path="/dashboard/buyer" element={
              <ProtectedRoute roles={['buyer']}><DM><BuyerDashboard /></DM></ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={
              <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center gap-4">
                <p className="text-white text-6xl font-black">404</p>
                <p className="text-blue-200/60 text-lg">Page not found</p>
                <a href="/" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
