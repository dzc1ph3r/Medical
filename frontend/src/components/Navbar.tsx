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
    <header className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand">
          MedCare
        </Link>

        <nav className="navbar__links">
          <Link to="/">Médecins</Link>

          {user?.role === "PATIENT" && <Link to="/patient/dashboard">Mes RDV</Link>}
          {user?.role === "DOCTOR" && <Link to="/doctor/dashboard">Calendrier</Link>}
        </nav>
      </div>

      <div className="navbar__actions">
        {!user ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            <span className="navbar__user">
              {user.name} — <b>{user.role}</b>
            </span>
            <button onClick={onLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </header>
  );
}
