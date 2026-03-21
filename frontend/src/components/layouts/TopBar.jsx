import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-right">
        <span className="topbar-role">{user?.role}</span>
        <button
          className="topbar-change-password"
          onClick={() => navigate("/change-password")}
        >
          Change Password
        </button>
      </div>
    </header>
  );
}