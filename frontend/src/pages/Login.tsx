import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Stethoscope,
  Users,
  Shield,
  Loader2
} from "../components/icons";

export default function Login() {
  const navigate = useNavigate();
  const { setToken, refreshMe, user } = useAuth();

  // ✅ Si déjà connecté, redirige selon le rôle
  if (user?.role === "DOCTOR") return <Navigate to="/doctor/dashboard" replace />;
  if (user?.role === "PATIENT") return <Navigate to="/patient/dashboard" replace />;
  if (user?.role === "ADMIN") return <Navigate to="/admin" replace />;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      const res = await loginApi({ email, password });

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
        navigate("/admin", { replace: true });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          "Échec de connexion. Veuillez vérifier vos identifiants.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-500/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            MediConnect
          </h1>
          <p className="text-slate-600">
            Votre plateforme médicale sécurisée
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2"></div>
          
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Connexion à votre compte
              </h2>
              <p className="text-slate-600">
                Accédez à votre tableau de bord patient ou médecin
              </p>
            </div>

            {/* Role Selection (Visual only) */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Patient</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                  <Stethoscope className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Médecin</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Admin</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">
                      Se souvenir de moi
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-sm text-slate-500">Ou continuer avec</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Alternative Login Options */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Registration Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Pas encore de compte ?{" "}
                <Link 
                  to="/register" 
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Créer un compte
                </Link>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                En vous connectant, vous acceptez nos{" "}
                <Link to="/terms" className="text-blue-500 hover:text-blue-600">
                  conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link to="/privacy" className="text-blue-500 hover:text-blue-600">
                  politique de confidentialité
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Accounts (for development) */}
        <div className="mt-8 bg-blue-50/50 backdrop-blur-sm rounded-xl border border-blue-100 p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Comptes de démonstration</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>👨‍⚕️ Médecin:</span>
              <code className="bg-white/50 px-2 py-1 rounded">doctor@demo.com / demo123</code>
            </div>
            <div className="flex justify-between">
              <span>👤 Patient:</span>
              <code className="bg-white/50 px-2 py-1 rounded">patient@demo.com / demo123</code>
            </div>
            <div className="flex justify-between">
              <span>👑 Admin:</span>
              <code className="bg-white/50 px-2 py-1 rounded">admin@demo.com / demo123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
