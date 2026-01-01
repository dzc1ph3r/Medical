import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import { Mail, Shield, Loader2, ArrowLeft } from "../components/icons";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Une erreur est survenue");
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
                    <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié ?</h1>
                    <p className="text-slate-600 mt-2">Entrez votre email pour réinitialiser votre mot de passe</p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6">
                            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.
                            <br /><small>(Vérifiez la console du serveur pour le token de test)</small>
                        </div>
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Retour à la connexion
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer le lien"}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="text-slate-500 hover:text-slate-700 text-sm flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Retour à la connexion
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
