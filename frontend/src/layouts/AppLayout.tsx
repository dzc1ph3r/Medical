import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import NotificationBell from "../components/NotificationBell";
import useAuth from "../hooks/useAuth";
import { Home, Calendar, User, Settings, LogOut, Bell, Menu, X } from "../components/icons";

interface AppLayoutProps {
  children?: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { logout } = useAuth() || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  // Determine if we're on a dashboard page
  const isDashboard = location.pathname.includes('/dashboard');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items for sidebar
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", active: isDashboard },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10">
        {/* Header with enhanced Navbar */}
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrollPosition > 20
            ? 'bg-white/90 backdrop-blur-lg shadow-soft-lg border-b border-slate-200/50'
            : 'bg-transparent'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navbar />
          </div>
        </header>

        <div className="flex">
          {/* Sidebar - Desktop */}
          {isDashboard && (
            <aside className="hidden lg:block w-64 xl:w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200/50 min-h-[calc(100vh-80px)] sticky top-20 self-start">
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Navigation
                  </h3>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.path}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${item.active
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <item.icon className={`w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110 ${item.active ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'
                          }`} />
                        {item.label}
                        {item.active && (
                          <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        )}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* User Profile Summary */}
                <div className="mt-12 pt-6 border-t border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Dr. Jane Doe</p>
                      <p className="text-xs text-slate-500">Cardiologist</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Mobile Menu Button */}
            {isDashboard && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}

            {/* Mobile Sidebar */}
            {isDashboard && isMobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-30">
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Sidebar Panel */}
                <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl animate-slide-in-right">
                  <div className="p-6 h-full overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold text-slate-900">Menu</h3>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-slate-100"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <nav className="space-y-2 mb-8">
                      {navItems.map((item) => (
                        <a
                          key={item.label}
                          href={item.path}
                          className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5 mr-3 text-slate-400" />
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Content Container */}
            <div className={`${isDashboard ? 'max-w-6xl' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8`}>
              {/* Page Header */}
              {isDashboard && (
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Welcome back, <span className="text-gradient-primary">Dr. Jane</span>
                      </h1>
                      <p className="text-slate-600 mt-2">
                        Here's what's happening with your medical practice today.
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-3">
                      <NotificationBell />
                      <button className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105">
                        + New Appointment
                      </button>
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Today's Appointments</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Pending Requests</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">5</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-amber-500" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-soft">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Available Slots</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">8</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className={isDashboard ? '' : 'animate-fade-in'}>
                {children || <Outlet />}
              </div>

              {/* Floating Help Button */}
              <button className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-110 group">
                <span className="text-lg font-bold">?</span>
                <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Need Help?
                </span>
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Global Toast Container */}
      <div className="fixed bottom-24 right-6 z-50 space-y-3">
        {/* Example Toast - You can make this dynamic */}
        <div className="toast animate-slide-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900">Appointment confirmed</p>
              <p className="mt-1 text-sm text-slate-500">Your appointment is scheduled for tomorrow at 10 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
