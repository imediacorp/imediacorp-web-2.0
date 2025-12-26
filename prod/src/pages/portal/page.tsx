import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ClientDashboard from './components/ClientDashboard';
import StaffDashboard from './components/StaffDashboard';

export default function PortalPage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on role
  if (profile.role === 'admin' || profile.role === 'staff') {
    return <StaffDashboard />;
  }

  return <ClientDashboard />;
}
