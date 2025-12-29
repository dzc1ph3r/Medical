import Navbar from "../components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 18 }}>
        {children}
      </main>
    </div>
  );
}
