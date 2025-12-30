var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { getMyNotifications } from "../api/notification.api";
import { useAuth } from "../context/AuthContext";
export default function NotificationBell() {
    const { token, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!token || (user === null || user === void 0 ? void 0 : user.role) !== "PATIENT")
            return;
        const fetchNotifications = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield getMyNotifications(token);
                setNotifications(res.data);
            }
            catch (_a) {
                setNotifications([]);
            }
        });
        fetchNotifications();
    }, [token, user === null || user === void 0 ? void 0 : user.role]);
    const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);
    if (!user || user.role !== "PATIENT")
        return null;
    return (_jsxs("div", { style: { position: "relative" }, children: [_jsxs("button", { onClick: () => setOpen((value) => !value), style: {
                    position: "relative",
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #e5e5e5",
                    background: "#fff",
                    cursor: "pointer",
                }, children: ["\uD83D\uDD14", unreadCount > 0 && (_jsx("span", { style: {
                            position: "absolute",
                            top: -6,
                            right: -6,
                            background: "#e53935",
                            color: "#fff",
                            borderRadius: 999,
                            padding: "2px 6px",
                            fontSize: 12,
                            fontWeight: 700,
                        }, children: unreadCount }))] }), open && (_jsxs("div", { style: {
                    position: "absolute",
                    right: 0,
                    marginTop: 8,
                    width: 320,
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    zIndex: 50,
                }, children: [_jsx("div", { style: { padding: 12, borderBottom: "1px solid #f2f2f2" }, children: _jsx("strong", { children: "Notifications" }) }), _jsx("div", { style: { maxHeight: 320, overflowY: "auto" }, children: notifications.length === 0 ? (_jsx("div", { style: { padding: 12, color: "#777" }, children: "Aucune notification." })) : (notifications.map((notification) => (_jsxs("div", { style: {
                                padding: 12,
                                borderBottom: "1px solid #f6f6f6",
                                background: notification.read ? "#fff" : "#f7fbff",
                            }, children: [_jsx("div", { style: { fontSize: 14 }, children: notification.message }), notification.createdAt && (_jsx("div", { style: { fontSize: 12, color: "#888", marginTop: 4 }, children: new Date(notification.createdAt).toLocaleString("fr-FR") }))] }, notification._id)))) })] }))] }));
}
