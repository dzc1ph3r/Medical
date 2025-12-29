import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Forbidden() {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 48 }}>403</h1>
      <h2>Accès interdit</h2>

      <p style={{ maxWidth: 420, marginTop: 12 }}>
        Vous n’avez pas les permissions nécessaires pour accéder à cette page.
      </p>

      {user && (
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          Connecté en tant que <b>{user.role}</b>
        </p>
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <Link to="/" style={{ textDecoration: "underline" }}>
          Retour à l’accueil
        </Link>

        {user?.role === "DOCTOR" && (
          <Link to="/doctor/dashboard">Dashboard médecin</Link>
        )}

        {user?.role === "PATIENT" && (
          <Link to="/patient/dashboard">Dashboard patient</Link>
        )}
      </div>
    </div>
  );
}
