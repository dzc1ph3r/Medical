import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";
import {
  User,
  LogOut,
  Home,
  Stethoscope,
  Users,
  Shield,
  Calendar,
  Menu,
  X,
  ChevronDown
} from "./icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const dashboardPath =
    user?.role === "DOCTOR" ? "/doctor/dashboard" :
      user?.role === "ADMIN" ? "/admin" :
        "/patient/dashboard";

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "DOCTOR": return "Médecin";
      case "PATIENT": return "Patient";
      case "ADMIN": return "Administrateur";
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "DOCTOR": return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "PATIENT": return "bg-gradient-to-r from-emerald-500 to-emerald-600";
      case "ADMIN": return "bg-gradient-to-r from-purple-500 to-purple-600";
      default: return "bg-gradient-to-r from-slate-500 to-slate-600";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                  MediConnect
                </h1>
                <p className="text-xs text-slate-500">Santé Connectée</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/"
                className="flex items-center text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Link>

              {user?.role !== "DOCTOR" && user?.role !== "ADMIN" && (
                <Link
                  to="/doctors"
                  className="flex items-center text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Médecins
                </Link>
              )}

              {user?.role === "PATIENT" && (
                <Link
                  to="/patient/dashboard"
                  className="flex items-center text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Mes RDV
                </Link>
              )}

              {user?.role === "DOCTOR" && (
                <Link
                  to="/doctor/dashboard"
                  className="flex items-center text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendrier
                </Link>
              )}

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="flex items-center text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Administration
                </Link>
              )}
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notification Bell Component */}
                <NotificationBell
                  showForRoles={['PATIENT', 'DOCTOR', 'ADMIN']}
                  className="mr-2"
                />

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200 group"
                    onClick={() => setOpenProfileMenu(!openProfileMenu)}
                  >
                    <div className={`w-10 h-10 rounded-xl ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500 flex items-center">
                        {getRoleLabel(user.role)}
                        <ChevronDown className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                      </div>
                    </div>
                  </button>

                  {openProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenProfileMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-slide-in-down">
                        <div className="p-4 border-b border-slate-200">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold text-lg`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{user.name}</h4>
                              <p className="text-sm text-slate-500">{getRoleLabel(user.role)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            to={dashboardPath}
                            className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                            onClick={() => setOpenProfileMenu(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-slate-500" />
                            Mon tableau de bord
                          </Link>



                          <Link
                            to="/notifications"
                            className="flex items-center w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                            onClick={() => setOpenProfileMenu(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-slate-500" />
                            Toutes les notifications
                          </Link>
                        </div>

                        <div className="p-4 border-t border-slate-200">
                          <button
                            onClick={onLogout}
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Inscription Gratuite
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
          >
            {openMobileMenu ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMobileMenu && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg animate-slide-in-down">
          <div className="px-4 py-3">
            {user ? (
              <div className="mb-6">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl mb-4">
                  <div className={`w-12 h-12 rounded-xl ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{user.name}</h4>
                    <p className="text-sm text-slate-500">{getRoleLabel(user.role)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={dashboardPath}
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                    onClick={() => setOpenMobileMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-slate-500" />
                    Mon tableau de bord
                  </Link>

                  <Link
                    to="/"
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                    onClick={() => setOpenMobileMenu(false)}
                  >
                    <Home className="w-4 h-4 mr-3 text-slate-500" />
                    Accueil
                  </Link>

                  {user?.role !== "DOCTOR" && user?.role !== "ADMIN" && (
                    <Link
                      to="/doctors"
                      className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                      onClick={() => setOpenMobileMenu(false)}
                    >
                      <Users className="w-4 h-4 mr-3 text-slate-500" />
                      Médecins
                    </Link>
                  )}

                  <Link
                    to="/notifications"
                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                    onClick={() => setOpenMobileMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-slate-500" />
                    Mes notifications
                  </Link>

                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                  onClick={() => setOpenMobileMenu(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setOpenMobileMenu(false)}
                >
                  Inscription Gratuite
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
