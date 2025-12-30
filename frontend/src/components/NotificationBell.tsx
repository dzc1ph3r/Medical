import { useEffect, useMemo, useState } from "react";
import { getMyNotifications } from "../api/notification.api";
import { useAuth } from "../context/AuthContext";
import type { Notification } from "../types/notification";
import { Bell } from "./icons";

interface NotificationBellProps {
  className?: string;
  showForRoles?: string[];
}

export default function NotificationBell({ 
  className = "",
  showForRoles = ['PATIENT'] 
}: NotificationBellProps) {
  const { token, user } = useAuth();
  
  // Condition pour afficher ou non
  if (!user) {
    return null;
  }
  
  // Vérifiez si user.role existe
  const userRole = user.role || '';
  const shouldShow = showForRoles.includes(userRole);
  
  if (!shouldShow) {
    return null;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Fetch notifications
  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await getMyNotifications(token);
        setNotifications(res.data);
      } catch (err: any) {
        console.error("NotificationBell - Error fetching notifications:", err);
        setNotifications([]);
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

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
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
