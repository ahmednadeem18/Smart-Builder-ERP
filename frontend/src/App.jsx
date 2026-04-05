import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import ProtectedRoute from "./components/layouts/projectroute";
import Layout from "./components/layouts/Layout";
import Login from "./pages/login";
import ChangePassword from "./pages/ChangePassword";
import Clients from "./pages/Clients";
import Equipment from "./pages/Equipment";
import Finance from "./pages/Finance";
import Projects from "./pages/Project";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import Unauthorized from "./pages/Unauthorized";
import SubDashboard from "./pages/Subdashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["Director"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="clients" element={<Clients />} />
            <Route path="finance" element={<Finance />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="/subcontractor-dashboard" element={<SubDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;