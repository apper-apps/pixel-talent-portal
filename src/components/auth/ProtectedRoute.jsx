import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Let App.jsx handle redirect to login
  }

  return children;
};

export default ProtectedRoute;