import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register as registerApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { setToken, refreshMe, user } = useAuth();

  if (user?.role === "DOCTOR") return <Navigate to="/doctor/dashboard" replace />;
  if (user?.role === "PATIENT") return <Navigate to="/patient/dashboard" replace />;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("PATIENT");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        specialty: role === "DOCTOR" ? specialty : undefined,
        city: city || undefined,
      };

      const res = await registerApi(payload);
      const token: string = res.data.token;
      const loggedUser: { role: Role } = res.data.user;

      setToken(token);
      await refreshMe();

      if (loggedUser.role === "DOCTOR") {
        navigate("/doctor/dashboard", { replace: true });
      } else {
        navigate("/patient/dashboard", { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h2>Créer un compte</h2>
          <p>Rejoins MedCare pour gérer tes rendez-vous facilement.</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-field">
            <label>Nom</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-field">
            <label>Rôle</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Médecin</option>
            </select>
          </div>

          {role === "DOCTOR" && (
            <div className="form-field">
              <label>Spécialité</label>
              <input
                className="form-input"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-field">
            <label>Ville</label>
            <input className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading} className="button-primary">
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
