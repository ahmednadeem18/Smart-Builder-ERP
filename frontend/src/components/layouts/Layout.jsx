import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

const titles = {
  "/dashboard":      "Dashboard",
  "/projects":       "Projects",
  "/clients":        "Clients",
  "/finance":        "Finance",
  "/hr":             "Human Resources",
  "/materials":      "Materials",
  "/equipment":      "Equipment",
  "/subcontractors": "Subcontractors",
};

export default function Layout() {
  const location = useLocation();
  const title = titles[location.pathname] ?? "CMS";

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <TopBar title={title} />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
