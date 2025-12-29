import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { token, loadingMe } = useAuth();
  const location = useLocation();

  // ✅ Attendre la vérification /me avant de décider
  if (loadingMe) return <div>Chargement...</div>;

  // ✅ Si pas connecté, on redirige vers login (en gardant la page demandée)
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
