import { Link } from "react-router-dom";
import { Home, Search, Frown, ArrowLeft, AlertTriangle, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center">
          {/* Animated 404 Number */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-3xl opacity-30 rounded-full"></div>
            <h1 className="relative text-9xl font-black text-slate-900">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </span>
            </h1>
            
            {/* Floating Icons */}
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center animate-bounce-soft">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div className="absolute -top-6 -right-6 w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center animate-bounce-soft" style={{ animationDelay: '0.2s' }}>
              <AlertTriangle className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="absolute -bottom-6 left-1/4 w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center animate-bounce-soft" style={{ animationDelay: '0.4s' }}>
              <Frown className="w-6 h-6 text-violet-600" />
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-700">
                Page non trouvée
              </span>
            </div>
            
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Oups ! Cette page semble introuvable
            </h2>
            
            <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">
              La page que vous recherchez a peut-être été déplacée, 
              supprimée ou n'existe tout simplement pas.
            </p>

            {/* Possible Reasons */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm max-w-md mx-auto mb-10">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Causes possibles
              </h3>
              <ul className="space-y-3 text-left text-slate-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></span>
                  L'URL peut contenir une faute de frappe
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></span>
                  La page a été déplacée ou supprimée
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></span>
                  Vous n'avez pas les permissions nécessaires
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Retour à l'accueil
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-xl hover:border-blue-500 hover:text-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
              Page précédente
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-200/50 max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">
              Vous cherchez quelque chose de spécifique ?
            </h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full px-4 py-3 rounded-xl border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                placeholder="Rechercher sur le site..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Implement search logic here
                    window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`;
                  }
                }}
              />
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Essayez notre moteur de recherche ou explorez nos pages populaires
            </p>
          </div>

          {/* Popular Links */}
          <div className="mt-10">
            <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
              Pages populaires
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/doctors"
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200"
              >
                Trouver un médecin
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200"
              >
                Inscription
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-4">
              Si vous pensez qu'il s'agit d'une erreur, contactez notre support
            </p>
            <a
              href="mailto:support@mediconnect.dz"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <span className="mr-2">📧</span>
              support@mediconnect.dz
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}