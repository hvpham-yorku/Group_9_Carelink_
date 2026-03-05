/**
 * Wrapper to prevent unauthorized access
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
