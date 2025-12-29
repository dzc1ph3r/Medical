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
    <header className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand">
          MedCare
        </Link>

        <nav className="navbar__links">
          {user?.role !== "DOCTOR" && <Link to="/">Médecins</Link>}

          {user?.role === "PATIENT" && <Link to="/patient/dashboard">Mes RDV</Link>}
          {user?.role === "DOCTOR" && <Link to="/doctor/dashboard">Calendrier</Link>}
          {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        </nav>
      </div>

      <div className="navbar__actions">
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
            <span className="navbar__user">
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
