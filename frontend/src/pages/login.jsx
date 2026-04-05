import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const u = await login(form.username, form.password);
      const roleRoutes = {
        "Director":              "/dashboard",
        "Finance Manager":       "/finance-dashboard",
        "HR Manager":            "/hr-dashboard",
        "Project Manager":       "/pm-dashboard",
        "Material Manager":      "/material-dashboard",
        "Equipment Manager":     "/equipment-dashboard",
        "Sub Contractor Manager": "/subcontractor-dashboard",
      };
      navigate(roleRoutes[u.role] ?? "/unauthorized");
    } catch (err) {
      setError("Invalid username or password.");
      console.log("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>CMS Login</h1>
        <p>Construction Management System</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontSize: "13px",
                  padding: 0,
                }}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="error" style={{ marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}