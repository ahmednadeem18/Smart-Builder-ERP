import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  // 🛠️ Role ke hisaab se links decide karne ka function
  const getSidebarLinks = (role) => {
    switch (role) {
      case "Director":
        return [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/projects",  label: "Projects" },
          { to: "/clients",   label: "Clients" },
          { to: "/finance",   label: "Finance" },
          { to: "/equipment", label: "Equipment" },
        ];
      case "Sub Contractor Manager":
        return [
          { to: "/subcontractor-dashboard", label: "Subcontractor Requests" },
          // Agar isko aur kuch dikhana ho to yahan add kar sakte hain
        ];
      case "Finance Manager":
        return [
          { to: "/finance-dashboard", label: "Finance Dashboard" },
        ];
      case "HR Officer":
        return [
          { to: "/hr-dashboard", label: "HR Dashboard" },
        ];
      case "Material Manager":
      return [
        { to: "/material-dashboard", label: "Material Management" },
      ];
      default:
        // Agar koi aur role hai to by default sirf dashboard dikhega
        return [{ to: "/dashboard", label: "Dashboard" }];
    }
  };

  // 🚀 User ke role ke hisaab se links generate honge
  const links = getSidebarLinks(user?.role);

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