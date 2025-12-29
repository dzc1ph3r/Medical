import { useEffect, useMemo, useState } from "react";
import { getMyNotifications } from "../api/notification.api";
import { useAuth } from "../context/AuthContext";
import type { Notification } from "../types/notification";

export default function NotificationBell() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "PATIENT") return;

    const fetchNotifications = async () => {
      try {
        const res = await getMyNotifications(token);
        setNotifications(res.data);
      } catch {
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [token, user?.role]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  if (!user || user.role !== "PATIENT") return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((value) => !value)}
        style={{
          position: "relative",
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #e5e5e5",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "#e53935",
              color: "#fff",
              borderRadius: 999,
              padding: "2px 6px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            width: 320,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            zIndex: 50,
          }}
        >
          <div style={{ padding: 12, borderBottom: "1px solid #f2f2f2" }}>
            <strong>Notifications</strong>
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 12, color: "#777" }}>Aucune notification.</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #f6f6f6",
                    background: notification.read ? "#fff" : "#f7fbff",
                  }}
                >
                  <div style={{ fontSize: 14 }}>{notification.message}</div>
                  {notification.createdAt && (
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {new Date(notification.createdAt).toLocaleString("fr-FR")}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
