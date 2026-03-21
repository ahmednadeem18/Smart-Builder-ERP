import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects",  label: "Projects" },
  { to: "/clients",   label: "Clients" },
  { to: "/finance",   label: "Finance" },
  { to: "/equipment", label: "Equipment" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>CMS</h2>
        <p>Construction ERP</p>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-user">{user?.username}</p>
        <p className="sidebar-role">{user?.role}</p>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
}