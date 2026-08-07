import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  // Don't redirect prematurely - wait until we know for sure whether a
  // valid session cookie exists (the initial getCurrentUser() check).
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
