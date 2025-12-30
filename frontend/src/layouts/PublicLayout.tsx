// frontend/src/layouts/PublicLayout.tsx
import { ReactNode } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Heart,
  Shield,
  Clock,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';

export default function PublicLayout() {
  const location = useLocation();
  
  const features = [
    {
      icon: Clock,
      title: "Rendez-vous Rapides",
      description: "Prenez rendez-vous en moins de 2 minutes"
    },
    {
      icon: Shield,
      title: "Sécurité des Données",
      description: "Vos données médicales sont cryptées et sécurisées"
    },
    {
      icon: Users,
      title: "Experts Certifiés",
      description: "Tous nos médecins sont qualifiés et expérimentés"
    },
    {
      icon: Award,
      title: "Service Premium",
      description: "Support client 24/7 pour vos besoins médicaux"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">MediConnect</h1>
                <p className="text-xs text-slate-500">Santé Connectée</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'text-blue-600' 
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                Accueil
              </Link>
              <Link 
                to="/doctors" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/doctors' 
                    ? 'text-blue-600' 
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                Médecins
              </Link>
              <Link 
                to="/services" 
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                Services
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                À propos
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Inscription Gratuite
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Outlet />
        </div>
      </main>

      {/* Features Section (only on home page) */}
      {location.pathname === '/' && (
        <section className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Pourquoi Choisir MediConnect ?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                La plateforme médicale la plus complète et sécurisée pour vos soins de santé
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">MediConnect</h3>
              </div>
              <p className="text-slate-300 text-sm">
                Votre partenaire de confiance pour des soins de santé accessibles et de qualité.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/doctors" className="text-slate-300 hover:text-white transition-colors duration-200">
                    Trouver un Médecin
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-slate-300 hover:text-white transition-colors duration-200">
                    Nos Services
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-300 hover:text-white transition-colors duration-200">
                    À Propos
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-300 hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors duration-200">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-slate-300 hover:text-white transition-colors duration-200">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-slate-300 hover:text-white transition-colors duration-200">
                    Politique des cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contactez-nous</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>contact@mediconnect.dz</li>
                <li>+213 XX XX XX XX XX</li>
                <li>Alger, Algérie</li>
              </ul>
              <div className="mt-4 flex space-x-3">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <span className="text-xs font-bold">FB</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <span className="text-xs font-bold">TW</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                  <span className="text-xs font-bold">IN</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} MediConnect. Tous droits réservés.</p>
            <p className="mt-1">Plateforme de gestion médicale Algérienne</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <Link
        to="/register"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <span className="font-semibold">Commencer Maintenant</span>
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </Link>
    </div>
  );
}