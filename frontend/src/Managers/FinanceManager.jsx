import { useEffect, useState } from "react";
import { financeAPI } from "../api/axios"

function Badge({ status }) {
  const styles = {
    Requested: { color: "#2563eb", background: "#eff6ff" },
    Approved:  { color: "#16a34a", background: "#f0fdf4" },
    Declined:  { color: "#dc2626", background: "#fef2f2" },
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

export default function FinanceDashboard() {
  const [tab,      setTab]      = useState("payments");
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    Promise.all([
      financeAPI.getExpenses(),
      financeAPI.getRevenues(),
      financeAPI.getPendingPayments(),
      financeAPI.getPendingInvoices(),
    ])
      .then(([exp, rev, pay, inv]) => {
        setExpenses(exp.data.data ?? []);
        setRevenues(rev.data.data ?? []);
        setPayments(pay.data.data ?? []);
        setInvoices(inv.data.data ?? []);
      })
      .catch(() => setError("Failed to load finance data."))
      .finally(() => setLoading(false));
  }, []);

  const handleApprovePayment = async (id) => {
    try {
      await financeAPI.approvePayment(id);
      setPayments((prev) => prev.filter((p) => p.payment_request_id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve.");
    }
  };

  const handleApproveInvoice = async (id) => {
    try {
      await financeAPI.approveInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve.");
    }
  };

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalRevenues = revenues.reduce((s, r) => s + Number(r.amount), 0);
  const profit        = totalRevenues - totalExpenses;

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="dashboard">

      <div className="page-header">
        <div>
          <h2 className="page-heading">Finance Dashboard</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            Manage payments, invoices, expenses and revenues
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="stat-grid">
        <div className="stat-card" style={{ borderTop: "3px solid #dc2626" }}>
          <p className="stat-label">Total Expenses</p>
          <p className="stat-value" style={{ color: "#dc2626" }}>
            PKR {totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #16a34a" }}>
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value" style={{ color: "#16a34a" }}>
            PKR {totalRevenues.toLocaleString()}
          </p>
        </div>
        <div className="stat-card"
          style={{ borderTop: `3px solid ${profit >= 0 ? "#0a7073" : "#dc2626"}` }}>
          <p className="stat-label">{profit >= 0 ? "Net Profit" : "Net Loss"}</p>
          <p className="stat-value" style={{ color: profit >= 0 ? "#0a7073" : "#dc2626" }}>
            PKR {Math.abs(profit).toLocaleString()}
          </p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #d97706" }}>
          <p className="stat-label">Pending Payments</p>
          <p className="stat-value" style={{ color: "#d97706" }}>{payments.length}</p>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #9333ea" }}>
          <p className="stat-label">Pending Invoices</p>
          <p className="stat-value" style={{ color: "#9333ea" }}>{invoices.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        <Tab label={`Pending Payments (${payments.length})`}
          active={tab === "payments"} onClick={() => setTab("payments")} />
        <Tab label={`Pending Invoices (${invoices.length})`}
          active={tab === "invoices"} onClick={() => setTab("invoices")} />
        <Tab label="Expenses" active={tab === "expenses"} onClick={() => setTab("expenses")} />
        <Tab label="Revenues" active={tab === "revenues"} onClick={() => setTab("revenues")} />
      </div>

      {/* Pending Payments */}
      {tab === "payments" && (
        <div className="table-card">
          <h3 className="table-title">Pending Payment Requests</h3>
          {payments.length === 0 ? <p className="empty">No pending payments.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Requested By</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>IBAN</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.payment_request_id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{p.project_name}</td>
                    <td style={{ textTransform: "capitalize" }}>{p.expense_category}</td>
                    <td>{p.requested_by}</td>
                    <td style={{ fontWeight: 600 }}>
                      PKR {Number(p.amount).toLocaleString()}
                    </td>
                    <td>{p.bank_name ?? "—"}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 11 }}>
                      {p.IBAN ?? "—"}
                    </td>
                    <td>{p.date?.slice(0, 10)}</td>
                    <td>
                      <button
                        className="btn-primary"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => handleApprovePayment(p.payment_request_id)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pending Invoices */}
      {tab === "invoices" && (
        <div className="table-card">
          <h3 className="table-title">Pending Invoice Requests</h3>
          {invoices.length === 0 ? <p className="empty">No pending invoices.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Requested By</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={inv.id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{inv.project_name}</td>
                    <td>{inv.client_name}</td>
                    <td>{inv.requested_by}</td>
                    <td style={{ fontWeight: 600 }}>
                      PKR {Number(inv.amount).toLocaleString()}
                    </td>
                    <td>{inv.req_date?.slice(0, 10)}</td>
                    <td>
                      <button
                        className="btn-primary"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => handleApproveInvoice(inv.id)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Expenses */}
      {tab === "expenses" && (
        <div className="table-card">
          <h3 className="table-title">All Expenses</h3>
          {expenses.length === 0 ? <p className="empty">No expenses.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e, i) => (
                  <tr key={e.id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{e.project_name}</td>
                    <td style={{ textTransform: "capitalize" }}>{e.category}</td>
                    <td style={{ fontWeight: 600, color: "#dc2626" }}>
                      PKR {Number(e.amount).toLocaleString()}
                    </td>
                    <td>{e.date?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Revenues */}
      {tab === "revenues" && (
        <div className="table-card">
          <h3 className="table-title">All Revenues</h3>
          {revenues.length === 0 ? <p className="empty">No revenues.</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {revenues.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{r.project_name}</td>
                    <td>{r.client_name}</td>
                    <td style={{ fontWeight: 600, color: "#16a34a" }}>
                      PKR {Number(r.amount).toLocaleString()}
                    </td>
                    <td>{r.rev_date?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}