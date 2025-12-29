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
    <div style={{ maxWidth: 480, margin: "60px auto" }}>
      <h2>Créer un compte</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Rôle</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Médecin</option>
          </select>
        </div>

        {role === "DOCTOR" && (
          <div style={{ marginTop: 12 }}>
            <label>Spécialité</label>
            <input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <label>Ville</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Création..." : "Créer le compte"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}
