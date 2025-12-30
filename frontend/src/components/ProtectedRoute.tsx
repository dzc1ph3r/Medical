import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";

export default function ProtectedRoute({
  role,
  children,
}: {
  role?: Role | Role[]; // Accepte un rôle OU un tableau de rôles (optionnel)
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

  // ⛔ Vérification des rôles (si role est fourni)
  if (role) {
    if (Array.isArray(role)) {
      // Si role est un tableau, vérifie si le rôle de l'utilisateur est dans le tableau
      if (!role.includes(user.role)) {
        return <Navigate to="/403" replace />;
      }
    } else {
      // Si role est une string, vérifie l'égalité
      if (user.role !== role) {
        return <Navigate to="/403" replace />;
      }
    }
  }

  return children;
}