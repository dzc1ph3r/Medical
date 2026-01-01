import type { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import { User, Bell, Home } from '../components/icons';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth() || {};
  const location = useLocation();

  /* 
    FIX: Using dynamic navigation based on user role would be better here.
    However, the current architecture seems to wrap specific dashboard pages (PatientDashboard, DoctorDashboard)
    inside this layout, but those pages implemented their OWN tabs/Sidebar?
    
    Actually, looking at App.tsx:
    <RoleRoute>
      <DashboardLayout>
        <PatientDashboard /> 
      </DashboardLayout>
    </RoleRoute>

    And PatientDashboard.tsx has its own tabs: "Rendez-vous", "Documents", "Profil".
    
    The DashboardLayout sidebar seems redundant or conflicting with the internal page tabs if it links to separate pages like '/appointments' which don't exist as separate routes in App.tsx. 
    
    The user asked to "reparer les redirections des bouttons". The buttons in this Sidebar point to /dashboard, /appointments, etc., which are NOT defined in App.tsx.
    
    I should hide this sidebar or make it compatible with the single-page dashboard structure. 
    Or better, since the Dashboards (Patient/Doctor) handle their own navigation via internal state (Tabs), 
    this Layout should probably NOT have a conflicting Sidebar navigation that points to non-existent routes.
    
    I will remove the specific navigation items that don't exist and instead rely on the main dashboard page.
    Or, I can make the links scroll to sections or just remove the sidebar navigation items that are broken.
    
    Given the structure, it seems DashboardLayout is just a wrapper for style. 
    The "Sidebar" here has hardcoded links to /appointments, /patients etc that don't exist.
    
    I will remove the sidebar navigation items or disable them.
  */

  // Let's keep it simple: The DashboardLayout sidebar should probably just link to the main Dashboard
  // or be removed if the inner pages handle navigation.
  // But since the user complained about broken "buttons redirections", this is likely the culprit.

  const dashboardPath = user?.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";



  // Actually, let's just show the Dashboard link and Notifications which exists.
  const refinedNavItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: User, label: 'Mon Tableau de bord', path: dashboardPath },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
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
              {refinedNavItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'
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
