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
    <header className="navbar bg-white/80 backdrop-blur">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand flex items-center gap-2">
          <span className="logo-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 2C7.03 2 3 6.03 3 11c0 4.5 3.14 8.26 7.39 8.94L12 22l1.61-2.06C17.86 19.26 21 15.5 21 11c0-4.97-4.03-9-9-9z"
                fill="#38bdf8"
              />
              <path
                d="M9 10.5h2.5V8h2v2.5H16v2h-2.5V15h-2v-2.5H9v-2z"
                fill="#0f172a"
              />
            </svg>
          </span>
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
