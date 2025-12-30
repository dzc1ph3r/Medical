import { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import { Calendar, User, FileText, Settings, Bell, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth() || {};
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: User, label: 'Patients', path: '/patients' },
    { icon: FileText, label: 'Medical Records', path: '/records' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                {user?.name || 'User'}'s Dashboard
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200/50 min-h-screen sticky top-0">
          <div className="p-6">
            {/* User Profile */}
            <div className="mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.[0] || 'U'}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {user?.name || 'User'} {user?.name || ''}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Today's Appointments</span>
                  <span className="font-semibold text-slate-900">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pending Requests</span>
                  <span className="font-semibold text-slate-900">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Messages</span>
                  <span className="font-semibold text-slate-900">12</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Welcome to your Dashboard
              </h1>
              <p className="text-slate-600">
                Here's an overview of your medical practice and appointments.
              </p>
            </div>

            {/* Page Content */}
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}