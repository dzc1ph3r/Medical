import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      style={{
        padding: "12px 18px",
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>
          MedCare
        </Link>

        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Médecins</Link>

          {user?.role === "PATIENT" && <Link to="/patient/dashboard">Mes RDV</Link>}
          {user?.role === "DOCTOR" && <Link to="/doctor/dashboard">Calendrier</Link>}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {!user ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            <span style={{ opacity: 0.8 }}>
              {user.name} — <b>{user.role}</b>
            </span>
            <button onClick={onLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </header>
  );
}
