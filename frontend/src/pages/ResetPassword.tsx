import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth.api";
import { Lock, Shield, Loader2, Eye, EyeOff } from "../components/icons";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Token invalide ou manquant.</p>
            </div>
        );
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await resetPassword(token, password);
            alert("Mot de passe mis à jour !");
            navigate("/login");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Erreur de réinitialisation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Nouveau mot de passe</h1>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="pl-10 pr-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                placeholder="Votre nouveau mot de passe"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                    <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Réinitialiser"}
                    </button>
                </form>
            </div>
        </div>
    );
}
