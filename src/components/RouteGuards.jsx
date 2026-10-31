import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Only logged-in users can see these pages
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center-note">Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

// Login/Register pages: logged-in users are sent to the dashboard instead
export function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center-note">Loading...</p>;
  return user ? <Navigate to="/" replace /> : children;
}
