import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, financeAPI } from "../api/axios";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

function StatusBadge({ status }) {
  const styles = {
    Ongoing:   { color: "#2563eb", background: "#eff6ff" },
    Completed: { color: "#16a34a", background: "#f0fdf4" },
    Cancelled: { color: "#dc2626", background: "#fef2f2" },
  };
  const s = styles[status] ?? { color: "#64748b", background: "#f1f5f9" };
  return (
    <span style={{ ...s, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
      {status}
    </span>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value" style={{ color }}>{value}</p>
        </div>
        <span style={{ fontSize: "22px", opacity: 0.7 }}>{icon}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate                  = useNavigate();
  const [overview,  setOverview]  = useState(null);
  const [projects,  setProjects]  = useState([]);
  const [expenses,  setExpenses]  = useState([]);
  const [revenues,  setRevenues]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getProjects(),
      financeAPI.getExpenses(),
      financeAPI.getRevenues(),
    ])
      .then(([ovRes, prRes, expRes, revRes]) => {
        setOverview(ovRes.data.data);
        setProjects(prRes.data.data ?? []);
        setExpenses(expRes.data.data ?? []);
        setRevenues(revRes.data.data ?? []);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const projectChartData = () => {
    const months = {};
    projects.forEach((p) => {
      const month = p.start_date?.slice(0, 7);
      if (!month) return;
      if (!months[month]) months[month] = { month, Ongoing: 0, Completed: 0, Cancelled: 0 };
      months[month][p.status] = (months[month][p.status] ?? 0) + 1;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  };

  const financeChartData = () => {
    const months = {};

    expenses.forEach((e) => {
      const month = e.date?.slice(0, 7);
      if (!month) return;
      if (!months[month]) months[month] = { month, Revenue: 0, Expense: 0, Profit: 0 };
      months[month].Expense += Number(e.amount);
    });

    revenues.forEach((r) => {
      const month = r.rev_date?.slice(0, 7);
      if (!month) return;
      if (!months[month]) months[month] = { month, Revenue: 0, Expense: 0, Profit: 0 };
      months[month].Revenue += Number(r.amount);
    });

    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({ ...m, Profit: m.Revenue - m.Expense }));
  };

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalRevenues = revenues.reduce((s, r) => s + Number(r.amount), 0);
  const netProfit     = totalRevenues - totalExpenses;

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="error">{error}</p>;

  const projData    = projectChartData();
  const financeData = financeChartData();

  return (
    <div className="dashboard">

      {/* Page heading */}
      <div className="page-header">
        <div>
          <h2 className="page-heading">Director Dashboard</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            Company-wide overview
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/projects")}>
          View All Projects
        </button>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Total Projects"  value={overview?.total_projects ?? 0}     color="#0a7073" />
        <StatCard label="Ongoing"         value={overview?.ongoing_projects ?? 0}   color="#2563eb"  />
        <StatCard label="Completed"       value={overview?.completed_projects ?? 0} color="#16a34a"  />
        <StatCard label="Total Clients"   value={overview?.total_clients ?? 0}      color="#9333ea"  />

      </div>

      {/* Two charts side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Project Activity Chart */}
        {projData.length > 0 && (
          <div className="table-card">
            <h3 className="table-title">Project Activity by Month</h3>
            <div style={{ padding: "16px 8px" }}>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={projData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                  <Line type="monotone" dataKey="Ongoing"   stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Completed" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Cancelled" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Finance Chart */}
        {financeData.length > 0 && (
          <div className="table-card">
            <h3 className="table-title">Monthly Revenue, Expenses & Profit</h3>
            <div style={{ padding: "16px 8px" }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={financeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(value) => `PKR ${Number(value).toLocaleString()}`}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                  <Bar dataKey="Revenue" fill="#16a34a" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Expense" fill="#dc2626" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Profit"  fill="#0a7073" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Projects table */}
      <div className="table-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <h3 className="table-title" style={{ margin: 0 }}>Recent Projects</h3>
          <button className="btn-ghost" style={{ fontSize: "12px" }} onClick={() => navigate("/projects")}>
            View all →
          </button>
        </div>
        {projects.length === 0 ? (
          <p className="empty">No projects found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Client</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 8).map((p, i) => (
                <tr key={p.id} style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/projects/${p.id}`)}>
                  <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                  <td style={{ fontWeight: 500, color: "#0a7073" }}>{p.project_name}</td>
                  <td style={{ color: "#64748b" }}>{p.client_name ?? "—"}</td>
                  <td style={{ color: "#64748b" }}>{p.manager_name ?? "—"}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ color: "#64748b" }}>{p.start_date?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}