import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setToken, refreshMe, user } = useAuth();

  // ✅ Si déjà connecté, redirige selon le rôle
  if (user?.role === "DOCTOR") return <Navigate to="/doctor/dashboard" replace />;
  if (user?.role === "PATIENT") return <Navigate to="/patient/dashboard" replace />;
  if (user?.role === "ADMIN") return <Navigate to="/" replace />;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginApi(email, password);

      const token: string = res.data.token;
      const loggedUser: { role: "DOCTOR" | "PATIENT" | "ADMIN" } = res.data.user;

      // 1) Sauvegarder le token
      setToken(token);

      // 2) Charger /me (sécurité)
      await refreshMe();

      // 3) Redirection par rôle
      if (loggedUser.role === "DOCTOR") {
        navigate("/doctor/dashboard", { replace: true });
      } else if (loggedUser.role === "PATIENT") {
        navigate("/patient/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h2>Connexion</h2>
          <p>Accède à ton tableau de bord patient ou médecin.</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-field">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Mot de passe</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading} className="button-primary">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-footer">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
