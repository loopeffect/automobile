import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shown when an authenticated user tries to access a route their role can't access
const AccessDenied = ({ user }) => (
  <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center gap-5 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <div>
      <h1 className="text-white text-2xl font-bold">Access Denied</h1>
      <p className="text-blue-200/60 text-sm mt-2">
        Your account type (<span className="text-blue-400 font-medium capitalize">{user?.role}</span>) does not have permission to view this page.
      </p>
    </div>
    <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
      Go Home
    </a>
  </div>
);

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show spinner while token is being verified on mount
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to login, preserving intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → show access denied (NOT a silent redirect)
  if (roles && !roles.includes(user.role)) {
    return <AccessDenied user={user} />;
  }

  return children;
};

export default ProtectedRoute;

/**
 * GuestRoute — redirects already-authenticated users away from login/register.
 * Sends each role to their correct dashboard.
 */
export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    const dest = user.role === 'admin'
      ? '/dashboard/admin'
      : user.role === 'dealer'
      ? '/dashboard/dealer'
      : '/listings';
    return <Navigate to={dest} replace />;
  }

  return children;
};
