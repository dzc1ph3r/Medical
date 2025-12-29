import Navbar from "../components/Navbar";
import NotificationBell from "../components/NotificationBell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: 1100,
          margin: "12px auto 0",
          padding: "0 18px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <NotificationBell />
      </div>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 18 }}>
        {children}
      </main>
    </div>
  );
}
