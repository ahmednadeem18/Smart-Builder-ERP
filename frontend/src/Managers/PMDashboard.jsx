import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { pmAPI, adminAPI } from "../api/axios";

function Badge({ status }) {
  const styles = {
    Ongoing: { color: "#2563eb", background: "#eff6ff" },
    Completed: { color: "#16a34a", background: "#f0fdf4" },
    Cancelled: { color: "#dc2626", background: "#fef2f2" },
    Pending: { color: "#d97706", background: "#fffbeb" },
  };
  const s = styles[status] ?? { color: "#64748b", background: "#f1f5f9" };
  return (
    <span
      style={{
        ...s,
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 600,
        background: active ? "#0a7073" : "#f1f5f9",
        color: active ? "#fff" : "#64748b",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

export default function PMDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("projects");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logText, setLogText] = useState("");
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState("");
  const [logSuccess, setLogSuccess] = useState("");

  // Resource request form
  const [reqType, setReqType] = useState("material");
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState("");
  const [reqSuccess, setReqSuccess] = useState("");

  useEffect(() => {
    pmAPI
      .getMyProjects()
      .then(({ data }) => setProjects(data.data ?? []))
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectProject = async (project) => {
    if (selected?.id === project.id) {
      setSelected(null);
      setLogs([]);
      return;
    }
    setSelected(project);
    setReqForm({ ...reqForm, projectId: project.id });
    const { data } = await pmAPI.getProjectLogs(project.id);
    setLogs(data.data ?? []);
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!logText || !selected) return;
    setLogLoading(true);
    setLogError("");
    setLogSuccess("");
    try {
      await pmAPI.addLog({ projectId: selected.id, logText });
      setLogText("");
      setLogSuccess("Log added successfully.");
      const { data } = await pmAPI.getProjectLogs(selected.id);
      setLogs(data.data ?? []);
    } catch (err) {
      setLogError(err.response?.data?.message || "Failed to add log.");
    } finally {
      setLogLoading(false);
    }
  };
  // Inside PMDashboard component
  const [categories, setCategories] = useState([]);
  const [reqForm, setReqForm] = useState({
    projectId: "",
    categoryId: "",
    quantity: "",
    categoryType: "",
  });

  // Load categories dynamically when reqType changes
  useEffect(() => {
    if (tab === "request") {
      pmAPI
        .getCategories(reqType)
        .then((response) => {
          // Debugging ke liye logs
          console.log("Response from Backend:", response.data);

          // Aapka data response.data.data mein hai (Postman ke mutabiq)
          const categoriesList = response.data.data || [];

          setCategories(categoriesList);

          // Reset categoryId and type based on selection
          setReqForm((prev) => ({
            ...prev,
            categoryId: "",
            categoryType: reqType === "hr" ? prev.categoryType : "",
          }));
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setReqError("Failed to load categories.");
          setCategories([]); // Error par list khali kar dein
        });
    }
  }, [reqType, tab]);

  // Update handleRequest to send categoryType
  const handleRequest = async (e) => {
    e.preventDefault();
    setReqLoading(true);
    try {
      // Axios call: type URL mein jayega, aur baaki data body mein
      await pmAPI.submitRequest(reqType, {
        projectId: Number(reqForm.projectId),
        categoryId: Number(reqForm.categoryId),
        categoryType: reqForm.categoryType, // Sirf HR ke liye
        quantity: Number(reqForm.quantity),
        userId: user.id,
      });

      setReqSuccess("Request submitted successfully!");
      setReqForm({
        projectId: "",
        categoryId: "",
        quantity: "",
        categoryType: "",
      });
    } catch (err) {
      setReqError(err.response?.data?.message || "Request failed.");
    } finally {
      setReqLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h2 className="page-heading">Project Manager Dashboard</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            Manage your projects, logs and resource requests
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="stat-grid">
        <div className="stat-card" style={{ borderTop: "3px solid #0a7073" }}>
          <p className="stat-label">My Projects</p>
          <p className="stat-value" style={{ color: "#0a7073" }}>
            {projects.length}
          </p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #2563eb" }}>
          <p className="stat-label">Ongoing</p>
          <p className="stat-value" style={{ color: "#2563eb" }}>
            {projects.filter((p) => p.status === "Ongoing").length}
          </p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #16a34a" }}>
          <p className="stat-label">Completed</p>
          <p className="stat-value" style={{ color: "#16a34a" }}>
            {projects.filter((p) => p.status === "Completed").length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        <Tab
          label="My Projects"
          active={tab === "projects"}
          onClick={() => setTab("projects")}
        />
        <Tab
          label="Request Resources"
          active={tab === "request"}
          onClick={() => setTab("request")}
        />
      </div>

      {/* Projects Tab */}
      {tab === "projects" && (
        <div className="table-card">
          <h3 className="table-title">Assigned Projects</h3>
          {projects.length === 0 ? (
            <p className="empty">No projects assigned.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th>Logs</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <>
                    <tr key={p.id}>
                      <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                      <td
                        style={{
                          fontWeight: 500,
                          color: "#0a7073",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/projects/${p.id}`)}
                      >
                        {p.project_name}
                      </td>{" "}
                      <td>{p.client_name}</td>
                      <td>{p.start_date?.slice(0, 10)}</td>
                      <td>
                        <Badge status={p.status} />
                      </td>
                      <td>
                        <button
                          className="btn-outline"
                          onClick={() => handleSelectProject(p)}
                        >
                          {selected?.id === p.id ? "Hide" : "View Logs"}
                        </button>
                      </td>
                    </tr>

                    {selected?.id === p.id && (
                      <tr key={`logs-${p.id}`}>
                        <td
                          colSpan={6}
                          style={{
                            background: "#f8fafc",
                            padding: "16px 20px",
                          }}
                        >
                          {/* Add log form */}
                          <form
                            onSubmit={handleAddLog}
                            style={{
                              marginBottom: "16px",
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <input
                              value={logText}
                              onChange={(e) => setLogText(e.target.value)}
                              placeholder="Add a progress update..."
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "13px",
                              }}
                            />
                            <button
                              type="submit"
                              className="btn-primary"
                              disabled={logLoading}
                            >
                              {logLoading ? "Adding..." : "Add Log"}
                            </button>
                          </form>
                          {logError && <p className="error">{logError}</p>}
                          {logSuccess && (
                            <p className="success">{logSuccess}</p>
                          )}

                          {/* Log history */}
                          {logs.length === 0 ? (
                            <p className="empty">No logs yet.</p>
                          ) : (
                            logs.map((log, i) => (
                              <div
                                key={log.id}
                                style={{
                                  padding: "10px 14px",
                                  background: "#fff",
                                  borderRadius: "8px",
                                  border: "1px solid #e2e8f0",
                                  marginBottom: "8px",
                                }}
                              >
                                <p
                                  style={{ fontSize: "13px", color: "#334155" }}
                                >
                                  {log.log_text}
                                </p>
                                <p
                                  style={{
                                    fontSize: "11px",
                                    color: "#94a3b8",
                                    marginTop: "4px",
                                  }}
                                >
                                  {log.log_date?.slice(0, 10)}
                                </p>
                              </div>
                            ))
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Request Resources Tab */}
      {tab === "request" && (
        <div className="form-card">
          <h3 className="form-title">Submit Resource Request</h3>
          <form onSubmit={handleRequest} className="project-form">
            <div className="form-group">
              <label>Resource Type</label>
              <select
                value={reqType}
                onChange={(e) => setReqType(e.target.value)}
              >
                <option value="material">Material</option>
                <option value="hr">Human Resource</option>
                <option value="equipment">Equipment</option>
                <option value="subcontractor">Subcontractor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Project</label>
              <select
                required
                value={reqForm.projectId}
                onChange={(e) =>
                  setReqForm({ ...reqForm, projectId: e.target.value })
                }
              >
                <option value="">Select project</option>
                {/* Sirf Ongoing projects ko filter karke dikhayenge */}
                {projects
                  .filter((p) => p.status === "Ongoing")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.project_name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                required
                value={reqForm.categoryId}
                onChange={(e) =>
                  setReqForm({ ...reqForm, categoryId: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {reqType === "hr" && (
              <div className="form-group">
                <label>Labour Type</label>
                <select
                  required
                  value={reqForm.categoryType}
                  onChange={(e) =>
                    setReqForm({ ...reqForm, categoryType: e.target.value })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="Skilled">Skilled</option>
                  <option value="Unskilled">Unskilled</option>
                  <option value="Engineer">Engineer</option>
                </select>
              </div>
            )}

            {/* Subcontractors usually don't need a quantity field, but materials/HR/Equipment do */}
            {reqType !== "subcontractor" && (
              <div className="form-group">
                <label>
                  {reqType === "hr" ? "Number of Workers" : "Quantity"}
                </label>
                <input
                  type="number"
                  required
                  value={reqForm.quantity}
                  onChange={(e) =>
                    setReqForm({ ...reqForm, quantity: e.target.value })
                  }
                />
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={reqLoading}>
              {reqLoading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
