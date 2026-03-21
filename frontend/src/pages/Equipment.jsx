import { useEffect, useState } from "react";
import { equipmentAPI } from "../api/axios";

function Badge({ status }) {
  const styles = {
    Available:   { color: "#16a34a", background: "#f0fdf4" },
    "In-use":    { color: "#2563eb", background: "#eff6ff" },
    Maintenance: { color: "#d97706", background: "#fffbeb" },
    Pending:     { color: "#d97706", background: "#fffbeb" },
    Approved:    { color: "#16a34a", background: "#f0fdf4" },
    Rejected:    { color: "#dc2626", background: "#fef2f2" },
    Paid:        { color: "#16a34a", background: "#f0fdf4" },
  };
  const s = styles[status] ?? { color: "#64748b", background: "#f1f5f9" };
  return (
    <span style={{ ...s, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
      {status}
    </span>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", borderRadius: "8px", border: "none",
      cursor: "pointer", fontSize: "13px", fontWeight: 600,
      background: active ? "#0a7073" : "#f1f5f9",
      color: active ? "#fff" : "#64748b", transition: "all 0.15s",
    }}>
      {label}
    </button>
  );
}

export default function Equipment() {
  const [tab,      setTab]      = useState("all");
  const [all,      setAll]      = useState([]);
  const [rented,   setRented]   = useState([]);
  const [owned,    setOwned]    = useState([]);
  const [pending,  setPending]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const [approveForm, setApproveForm] = useState({
    requestId: "", equipmentId: "", projectId: "", startDate: "", endDate: ""
  });
  const [activeApprove, setActiveApprove] = useState(null);
  const [approveError,  setApproveError]  = useState("");

  useEffect(() => {
    Promise.all([
      equipmentAPI.getAll(),
      equipmentAPI.getRented(),
      equipmentAPI.getOwned(),
      equipmentAPI.getPendingRequests(),
    ])
      .then(([a, r, o, p]) => {
        setAll(a.data.data ?? []);
        setRented(r.data.data ?? []);
        setOwned(o.data.data ?? []);
        setPending(p.data.data ?? []);
      })
      .catch(() => setError("Failed to load equipment data."))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (e) => {
    e.preventDefault();
    setApproveError("");
    try {
      await equipmentAPI.approveRequest({
        requestId:   Number(approveForm.requestId),
        equipmentId: Number(approveForm.equipmentId),
        projectId:   Number(approveForm.projectId),
        startDate:   approveForm.startDate,
        endDate:     approveForm.endDate,
      });
      setPending((prev) => prev.filter((p) => p.id !== activeApprove));
      setActiveApprove(null);
      setApproveForm({ requestId: "", equipmentId: "", projectId: "", startDate: "", endDate: "" });
    } catch (err) {
      setApproveError(err.response?.data?.message || "Failed to approve.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="dashboard">

      <div className="page-header">
        <h2 className="page-heading">Equipment</h2>
      </div>

      {/* Summary cards */}
      <div className="stat-grid">
        <div className="stat-card" style={{ borderTop: "3px solid #0a7073" }}>
          <p className="stat-label">Total Equipment</p>
          <p className="stat-value" style={{ color: "#0a7073" }}>{all.length}</p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #2563eb" }}>
          <p className="stat-label">Owned</p>
          <p className="stat-value" style={{ color: "#2563eb" }}>{owned.length}</p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #9333ea" }}>
          <p className="stat-label">Rented</p>
          <p className="stat-value" style={{ color: "#9333ea" }}>{rented.length}</p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #d97706" }}>
          <p className="stat-label">Pending Requests</p>
          <p className="stat-value" style={{ color: "#d97706" }}>{pending.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        <Tab label="All Equipment"   active={tab === "all"}     onClick={() => setTab("all")} />
        <Tab label="Owned"           active={tab === "owned"}   onClick={() => setTab("owned")} />
        <Tab label="Rented"          active={tab === "rented"}  onClick={() => setTab("rented")} />
        <Tab label={`Pending Requests (${pending.length})`} active={tab === "pending"} onClick={() => setTab("pending")} />
      </div>

      {/* All Equipment */}
      {tab === "all" && (
        <div className="table-card">
          <h3 className="table-title">All Equipment</h3>
          {all.length === 0 ? <p className="empty">No equipment found.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Ownership</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {all.map((e, i) => (
                  <tr key={e.id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{e.name}</td>
                    <td>{e.category}</td>
                    <td>{e.ownership_type}</td>
                    <td><Badge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Owned */}
      {tab === "owned" && (
        <div className="table-card">
          <h3 className="table-title">Owned Equipment</h3>
          {owned.length === 0 ? <p className="empty">No owned equipment.</p> : (
            <table className="table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Category</th><th>Status</th></tr>
              </thead>
              <tbody>
                {owned.map((e, i) => (
                  <tr key={e.id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{e.name}</td>
                    <td>{e.category}</td>
                    <td><Badge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Rented */}
      {tab === "rented" && (
        <div className="table-card">
          <h3 className="table-title">Rented Equipment</h3>
          {rented.length === 0 ? <p className="empty">No rented equipment.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipment</th>
                  <th>Renter</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Total Rent</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {rented.map((e, i) => (
                  <tr key={i}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{e.equipment}</td>
                    <td>{e.renter}</td>
                    <td>{e.start_date?.slice(0, 10)}</td>
                    <td>{e.end_date?.slice(0, 10) ?? "Ongoing"}</td>
                    <td style={{ fontWeight: 600 }}>PKR {Number(e.total_rent).toLocaleString()}</td>
                    <td><Badge status={e.payment_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pending Requests */}
      {tab === "pending" && (
        <div className="table-card">
          <h3 className="table-title">Pending Equipment Requests</h3>
          {pending.length === 0 ? <p className="empty">No pending requests.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Requested By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p, i) => (
                  <>
                    <tr key={p.id}>
                      <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{p.project_name}</td>
                      <td>{p.category}</td>
                      <td>{p.requester}</td>
                      <td><Badge status={p.status} /></td>
                      <td>
                        <button
                          className="btn-primary"
                          style={{ padding: "5px 12px", fontSize: "12px" }}
                          onClick={() => {
                            setActiveApprove(p.id);
                            setApproveForm({
                              requestId:   p.id,
                              equipmentId: "",
                              projectId:   p.project_id ?? "",
                              startDate:   "",
                              endDate:     ""
                            });
                          }}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                    {activeApprove === p.id && (
                      <tr key={`approve-${p.id}`}>
                        <td colSpan={6} style={{ background: "#f8fafc", padding: "16px 20px" }}>
                          <form onSubmit={handleApprove} className="project-form">
                            <div className="form-row">
                              <div className="form-group">
                                <label>Equipment ID</label>
                                <input type="number" placeholder="Equipment ID"
                                  value={approveForm.equipmentId}
                                  onChange={(e) => setApproveForm({ ...approveForm, equipmentId: e.target.value })} />
                              </div>
                              <div className="form-group">
                                <label>Project ID</label>
                                <input type="number" placeholder="Project ID"
                                  value={approveForm.projectId}
                                  onChange={(e) => setApproveForm({ ...approveForm, projectId: e.target.value })} />
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="form-group">
                                <label>Start Date</label>
                                <input type="date"
                                  value={approveForm.startDate}
                                  onChange={(e) => setApproveForm({ ...approveForm, startDate: e.target.value })} />
                              </div>
                              <div className="form-group">
                                <label>End Date</label>
                                <input type="date"
                                  value={approveForm.endDate}
                                  onChange={(e) => setApproveForm({ ...approveForm, endDate: e.target.value })} />
                              </div>
                            </div>
                            {approveError && <p className="error">{approveError}</p>}
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button type="submit" className="btn-primary">Confirm Approve</button>
                              <button type="button" className="btn-outline"
                                onClick={() => setActiveApprove(null)}>Cancel</button>
                            </div>
                          </form>
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

    </div>
  );
}