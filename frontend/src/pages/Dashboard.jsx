import { useEffect, useState } from "react";
import { adminAPI } from "../api/axios";

const statCards = (ov) => [
  { label: "Total Projects", value: ov?.total_projects ?? 0,   color: "#0a7073", bg: "#e6f4f4" },
  { label: "Ongoing",        value: ov?.ongoing_projects ?? 0, color: "#0a7073", bg: "#eff6ff" },
  { label: "Completed",      value: ov?.completed_projects ?? 0, color: "#0a7073", bg: "#f0fdf4" },
  { label: "Total Clients",  value: ov?.total_clients ?? 0,    color: "#0a7073", bg: "#faf5ff" },
];

function StatusBadge({ status }) {
  const styles = {
    Ongoing:   { color: "#2563eb", background: "#eff6ff" },
    Completed: { color: "#16a34a", background: "#f0fdf4" },
    Cancelled: { color: "#dc2626", background: "#fef2f2" },
  };
  const s = styles[status] ?? { color: "#64748b", background: "#f1f5f9" };
  return (
    <span style={{
      ...s,
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getProjects(),
    ])
      .then(([ovRes, prRes]) => {
        setOverview(ovRes.data.data);
        setProjects(prRes.data.data ?? []);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="dashboard">

      <div className="stat-grid">
        {statCards(overview).map((card) => (
          <div className="stat-card" key={card.label}
            style={{ borderTop: `3px solid ${card.color}` }}>
            <p className="stat-label">{card.label}</p>
            <p className="stat-value" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="table-card">
        <h3 className="table-title">All Projects</h3>
        {projects.length === 0 ? (
          <p className="empty">No projects found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Status</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{p.project_name}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.start_date?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}