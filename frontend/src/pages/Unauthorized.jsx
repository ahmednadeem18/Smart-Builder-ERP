import { useAuth } from "../context/authcontext";

export default function Unauthorized() {
  const { logout } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f4f6f9",
      gap: "16px"
    }}>
      <h1 style={{ fontSize: "64px", fontWeight: 800, color: "#e2e8f0" }}>403</h1>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b" }}>Access Denied</h2>
      <p style={{ fontSize: "14px", color: "#64748b" }}>
        You don't have permission to access this page.
      </p>
      <button className="btn-primary" onClick={logout}>
        Logout
      </button>
    </div>
  );
}