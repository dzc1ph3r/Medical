import Navbar from "../components/Navbar";
import NotificationBell from "../components/NotificationBell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">{children}</main>
    </div>
  );
}
