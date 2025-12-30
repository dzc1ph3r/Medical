import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyNotifications, markNotificationRead } from "../api/notification.api";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  useEffect(() => {
    if (!user || !token) return;

    const load = async () => {
      try {
        const res = await getMyNotifications(token);
        setNotifications(res.data);
      } catch (err: any) {
        setNotificationError(err?.response?.data?.message || "Notifications indisponibles");
      }
    };

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [user, token]);

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
              version="1.1"
              id="Icon_Set"
              xmlns="http://www.w3.org/2000/svg"
              x="0"
              y="0"
              viewBox="0 0 512 512"
              aria-hidden="true"
            >
              <style>{".st2{fill:#4c4372}"}</style>
              <g id="Medical_Folder">
                <circle cx="256" cy="256" r="207" style={{ fill: "#f0c48a" }} />
                <path
                  d="M400.046 325.372H111.954V149.075c0-13.099 10.619-23.718 23.718-23.718h71.417l21.853 22.823h147.386c13.099 0 23.718 10.619 23.718 23.718v153.474z"
                  style={{ fill: "#7babf1" }}
                />
                <path
                  className="st2"
                  d="M400.046 331.373H111.954a6 6 0 0 1-6-6V149.075c0-16.387 13.331-29.718 29.718-29.718h71.417c1.637 0 3.202.668 4.334 1.851l20.08 20.972h144.825c16.387 0 29.718 13.332 29.718 29.718v153.475a6 6 0 0 1-6 6zm-282.092-12h276.092V171.898c0-9.77-7.948-17.718-17.718-17.718H228.941a5.997 5.997 0 0 1-4.334-1.851l-20.08-20.972h-68.855c-9.77 0-17.718 7.948-17.718 17.718v170.298z"
                />
                <path
                  d="M376.328 386.643H135.672c-13.099 0-23.718-10.619-23.718-23.718V210.346c0-13.099 10.619-23.718 23.718-23.718h240.656c13.099 0 23.718 10.619 23.718 23.718v152.579c0 13.099-10.619 23.718-23.718 23.718z"
                  style={{ fill: "#d3e6f8" }}
                />
                <path
                  d="M376.328 186.627h-18.185v200.016h18.185c13.099 0 23.718-10.619 23.718-23.719V210.346c0-13.1-10.619-23.719-23.718-23.719z"
                  style={{ fill: "#a4cff2" }}
                />
                <path
                  style={{ fill: "#fd919e" }}
                  d="M311.427 267.622h-36.414v-36.414h-38.026v36.414h-36.414v38.027h36.414v36.414h38.026v-36.414h36.414z"
                />
                <path
                  className="st2"
                  d="M275.014 348.062h-38.027a6 6 0 0 1-6-6v-30.414h-30.414a6 6 0 0 1-6-6v-38.027a6 6 0 0 1 6-6h30.414v-30.414a6 6 0 0 1 6-6h38.027a6 6 0 0 1 6 6v30.414h30.414a6 6 0 0 1 6 6v38.027a6 6 0 0 1-6 6h-30.414v30.414a6 6 0 0 1-6 6zm-32.028-12h26.027v-30.414a6 6 0 0 1 6-6h30.414v-26.027h-30.414a6 6 0 0 1-6-6v-30.414h-26.027v30.414a6 6 0 0 1-6 6h-30.414v26.027h30.414a6 6 0 0 1 6 6v30.414z"
                />
                <g>
                  <path
                    className="st2"
                    d="M376.328 392.643H135.672c-16.387 0-29.718-13.332-29.718-29.718V210.346c0-16.387 13.331-29.718 29.718-29.718h240.656c16.387 0 29.718 13.332 29.718 29.718v152.579c0 16.387-13.331 29.718-29.718 29.718zM135.672 192.627c-9.77 0-17.718 7.948-17.718 17.718v152.579c0 9.77 7.948 17.718 17.718 17.718h240.656c9.77 0 17.718-7.948 17.718-17.718V210.346c0-9.77-7.948-17.718-17.718-17.718H135.672z"
                  />
                </g>
              </g>
            </svg>
          </span>
          MedCare
        </Link>

        <nav className="navbar__links">
          <Link to="/">Accueil</Link>
          {user?.role !== "DOCTOR" && <Link to="/doctors">Médecins</Link>}

          {user?.role === "PATIENT" && <Link to="/patient/dashboard">Mes RDV</Link>}
          {user?.role === "DOCTOR" && <Link to="/doctor/dashboard">Calendrier</Link>}
          {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        </nav>
      </div>

      <div className="navbar__actions">
        {user && (
          <div className="notification">
            <button
              className="notification-button"
              onClick={() => setOpenNotifications((prev) => !prev)}
              type="button"
            >
              <span className="notification-icon">🔔</span>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            {openNotifications && (
              <div className="notification-panel">
                <h4>Notifications</h4>
                {notificationError && <p className="form-error">{notificationError}</p>}
                {!notificationError && notifications.length === 0 && (
                  <p className="muted">Aucune notification.</p>
                )}
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification._id}>
                      <p>{notification.message}</p>
                      {!notification.read && (
                        <button
                          type="button"
                          className="button-link"
                          onClick={async () => {
                            if (!token) return;
                            await markNotificationRead(token, notification._id);
                            const res = await getMyNotifications(token);
                            setNotifications(res.data);
                          }}
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
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