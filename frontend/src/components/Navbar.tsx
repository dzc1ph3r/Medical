import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const dashboardPath =
    user?.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";

  return (
    <header
      style={{
        padding: "12px 18px",
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        background: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none", color: "#0f172a" }}>
          MedCare
        </Link>

        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#334155" }}>
            Médecins
          </Link>

          {user?.role === "PATIENT" && (
            <Link to="/patient/dashboard" style={{ textDecoration: "none", color: "#334155" }}>
              Mes RDV
            </Link>
          )}
          {user?.role === "DOCTOR" && (
            <Link to="/doctor/dashboard" style={{ textDecoration: "none", color: "#334155" }}>
              Calendrier
            </Link>
          )}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {!user ? (
          <>
            <Link to="/login" style={{ textDecoration: "none", color: "#334155" }}>
              Connexion
            </Link>
            <Link to="/register" style={{ textDecoration: "none", color: "#334155" }}>
              Inscription
            </Link>
          </>
        ) : (
          <>
            <Link
              to={dashboardPath}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: "#1d4ed8",
                color: "#fff",
                fontSize: 13,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Dashboard
            </Link>
            <span style={{ opacity: 0.8, color: "#475569" }}>
              {user.name} — <b>{user.role}</b>
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
}
