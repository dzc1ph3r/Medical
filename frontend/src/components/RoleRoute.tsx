import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";

export default function RoleRoute({
  role,
  children,
}: {
  role: Role;
  children: React.ReactElement;
}) {
  const { token, user, loadingMe } = useAuth();
  const location = useLocation();

  // ⏳ Attendre /me
  if (loadingMe) return <div>Chargement...</div>;

  // 🔐 Pas connecté → login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ⚠️ Token présent mais user absent
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Mauvais rôle → 403
  if (user.role !== role) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
