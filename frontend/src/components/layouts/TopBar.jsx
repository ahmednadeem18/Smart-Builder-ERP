import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <div className="topbar-user">
          <span className="topbar-role">{user?.role}</span>
        </div>
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