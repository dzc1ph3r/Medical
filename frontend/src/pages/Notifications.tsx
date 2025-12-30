import { useEffect, useMemo, useState } from "react";
import { getMyNotifications, markNotificationRead } from "../api/notification.api";
import { useAuth } from "../context/AuthContext";
import type { Notification } from "../types/notification";
import {
  Bell,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  MessageSquare,
  Check,
  Settings,
  Eye,
  Trash2
} from "../components/icons";

export default function Notifications() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');
  const [showMarkAll, setShowMarkAll] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!token || !user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyNotifications(token);
        setNotifications(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Impossible de charger les notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token, user]);

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }, [notifications, activeTab]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return;
    try {
      await markNotificationRead(token, notificationId);
      setNotifications(prev => prev.map(n =>
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        await markNotificationRead(token, notification._id);
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setShowMarkAll(false);
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications:", error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'SYSTEM':
        return <Bell className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `il y a ${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  onMouseEnter={() => setShowMarkAll(true)}
                  onMouseLeave={() => setShowMarkAll(false)}
                >
                  {showMarkAll ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmer
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tout marquer comme lu
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Non lues ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Toutes ({notifications.length})
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement des notifications...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-slate-600">{error}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">
                {activeTab === 'unread'
                  ? 'Aucune notification non lue'
                  : 'Aucune notification'}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Les nouvelles notifications apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-slate-50 transition-colors duration-200 cursor-pointer group ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.read ? 'bg-slate-100' : 'bg-blue-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-base ${
                        notification.read ? 'text-slate-700' : 'text-slate-900 font-medium'
                      }`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-500">
                              {notification.createdAt
                                ? formatRelativeTime(notification.createdAt)
                                : 'À l\'instant'}
                            </span>
                          </div>

                          {!notification.read && (
                            <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="p-2 hover:bg-slate-200 rounded-lg"
                              title="Marquer comme lu"
                            >
                              <Eye className="w-4 h-4 text-slate-500" />
                            </button>
                          )}
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 hover:bg-slate-200 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </button>

            {/* Notification Types Legend */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                Rendez-vous
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <MessageSquare className="w-4 h-4 text-emerald-600 mr-2" />
                Messages
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                Alertes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
