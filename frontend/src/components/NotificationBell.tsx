import { useEffect, useMemo, useState } from "react";
import { getMyNotifications, markNotificationRead } from "../api/notification.api";
import { useAuth } from "../context/AuthContext";
import type { Notification } from "../types/notification";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  MessageSquare,
  Check,
  ChevronRight,
  Settings,
  Eye,
  Trash2
} from "lucide-react";

interface NotificationBellProps {
  className?: string;
  showForRoles?: string[];
}

export default function NotificationBell({ 
  className = "",
  showForRoles = ['PATIENT'] 
}: NotificationBellProps) {
  const { token, user } = useAuth();
  
  // DEBUG - Supprimez ces console.log si tout fonctionne
  console.log("NotificationBell DEBUG - User:", user);
  console.log("NotificationBell DEBUG - User role:", user?.role);
  console.log("NotificationBell DEBUG - Show for roles:", showForRoles);

  // Condition pour afficher ou non
  if (!user) {
    console.log("NotificationBell - No user, not showing");
    return null;
  }
  
  // Vérifiez si user.role existe
  const userRole = user.role || '';
  const shouldShow = showForRoles.includes(userRole);
  
  console.log("NotificationBell - Should show:", shouldShow, "Role:", userRole);
  
  if (!shouldShow) {
    console.log("NotificationBell - Role not included, not showing");
    return null;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');
  const [showMarkAll, setShowMarkAll] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!token) {
      console.log("NotificationBell - No token available");
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("NotificationBell - Fetching notifications...");
        const res = await getMyNotifications(token);
        console.log("NotificationBell - Notifications received:", res.data.length);
        setNotifications(res.data);
      } catch (err: any) {
        console.error("NotificationBell - Error fetching notifications:", err);
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
  }, [token]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  console.log("NotificationBell - Unread count:", unreadCount);

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors duration-200 group"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors duration-200" />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ... le reste du code de NotificationBell ... */}
    </div>
  );
}