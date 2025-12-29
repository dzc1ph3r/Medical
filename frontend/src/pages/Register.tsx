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
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    specialty?: string;
  }>({});

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const nextFieldErrors: typeof fieldErrors = {};

    if (!name.trim()) nextFieldErrors.name = "Le nom est requis.";
    if (!email.trim()) nextFieldErrors.email = "L'email est requis.";
    if (!password.trim()) {
      nextFieldErrors.password = "Le mot de passe est requis.";
    } else if (password.trim().length < 6) {
      nextFieldErrors.password = "Minimum 6 caractères.";
    }
    if (role === "DOCTOR" && !specialty.trim()) {
      nextFieldErrors.specialty = "La spécialité est obligatoire.";
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

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
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 60%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 28,
          borderRadius: 16,
          background: "#ffffff",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: 0, color: "#64748b", fontWeight: 600 }}>Rejoindre MedCare</p>
          <h2 style={{ margin: "6px 0 0" }}>Créer un compte</h2>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 14 }}>
            Renseignez vos informations pour commencer.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 14, color: "#0f172a" }}>
            Nom complet
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Votre nom"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
            />
            {fieldErrors.name && (
              <span style={{ color: "#b91c1c", fontSize: 12 }}>
                {fieldErrors.name}
              </span>
            )}
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 14, color: "#0f172a" }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vous@email.com"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
            />
            {fieldErrors.email && (
              <span style={{ color: "#b91c1c", fontSize: 12 }}>
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 14, color: "#0f172a" }}>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 6 caractères"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
            />
            {fieldErrors.password && (
              <span style={{ color: "#b91c1c", fontSize: 12 }}>
                {fieldErrors.password}
              </span>
            )}
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 14, color: "#0f172a" }}>
            Rôle
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #cbd5f5",
                fontSize: 14,
                background: "#fff",
              }}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Médecin</option>
            </select>
          </label>

          {role === "DOCTOR" && (
            <label style={{ display: "grid", gap: 6, fontSize: 14, color: "#0f172a" }}>
              Spécialité
              <input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                placeholder="Cardiologie, pédiatrie..."
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #cbd5f5",
                  fontSize: 14,
                }}
              />
              {fieldErrors.specialty && (
                <span style={{ color: "#b91c1c", fontSize: 12 }}>
                  {fieldErrors.specialty}
                </span>
              )}
            </label>
          )}

          <label style={{ display: "grid", gap: 6, fontSize: 14, color: "#0f172a" }}>
            Ville
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Votre ville"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
            />
          </label>

          {error && (
            <p style={{ color: "#b91c1c", margin: 0, fontSize: 13 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "12px 16px",
              borderRadius: 10,
              border: "none",
              background: "#1d4ed8",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14, color: "#475569" }}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
