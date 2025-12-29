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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    if (password.trim().length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const res = await loginApi(email, password);

      const token: string = res.data.token;
      const loggedUser: { role: "DOCTOR" | "PATIENT" } = res.data.user;

      // 1) Sauvegarder le token
      setToken(token);

      // 2) Charger /me (sécurité)
      await refreshMe();

      // 3) Redirection par rôle
      if (loggedUser.role === "DOCTOR") {
        navigate("/doctor/dashboard", { replace: true });
      } else {
        navigate("/patient/dashboard", { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
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
        background: "linear-gradient(135deg, #f4f8ff 0%, #ffffff 60%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 28,
          borderRadius: 16,
          background: "#ffffff",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: 0, color: "#64748b", fontWeight: 600 }}>Bienvenue</p>
          <h2 style={{ margin: "6px 0 0" }}>Connexion</h2>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 14 }}>
            Accédez à votre espace MedCare en quelques secondes.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
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
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 14, color: "#0f172a" }}>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14, color: "#475569" }}>
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
