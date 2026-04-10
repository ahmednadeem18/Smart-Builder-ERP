import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { adminAPI } from "../api/axios";
import { useAuth } from "../context/authcontext";

function Section({ title, children }) {
  return (
    <div className="table-card">
      <h3 className="table-title">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value ?? "—"}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Ongoing: { color: "#2563eb", background: "#eff6ff" },
    Completed: { color: "#16a34a", background: "#f0fdf4" },
    Cancelled: { color: "#dc2626", background: "#fef2f2" },
    Free: { color: "#16a34a", background: "#f0fdf4" },
    Allocated: { color: "#d97706", background: "#fffbeb" },
    Approved: { color: "#16a34a", background: "#f0fdf4" },
    Requested: { color: "#2563eb", background: "#eff6ff" },
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

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminAPI
      .getProjectReport(id)
      .then(({ data }) => setReport(data.data))
      .catch(() => setError("Failed to load project report."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!report) return <p className="error">Project not found.</p>;

  const p = report.project;
  const planned = p.planned_budget ?? 0;
  const actual = report.expenses.reduce((sum, e) => sum + Number(e.total), 0);
  const variance = planned - actual;
  const isProfit = variance >= 0;
  const { user } = useAuth();

  const handleBack = () => {
    if (user?.role === "Project Manager") {
      navigate("/pm-dashboard");
    } else {
      navigate("/projects");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const left = 20;
    const right = 190;
    let y = 20;

    const line = () => {
      doc.setDrawColor(200);
      doc.line(left, y, right, y);
      y += 6;
    };

    const sectionTitle = (text) => {
      y += 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(text.toUpperCase(), left, y);
      y += 2;
      line();
    };

    const row = (label, value) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(label, left, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value ?? "—"), left + 55, y);
      y += 7;
    };

    const tableHeader = (cols, widths) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      let x = left;
      cols.forEach((col, i) => {
        doc.text(col, x, y);
        x += widths[i];
      });
      y += 2;
      line();
    };

    const tableRow = (cols, widths) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      let x = left;
      cols.forEach((col, i) => {
        doc.text(String(col ?? "—"), x, y);
        x += widths[i];
      });
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    };

    // ── Title ─────────────────────────────────────────
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT REPORT", left, y);
    y += 8;

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(p.project_name, left, y);
    y += 6;

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, left, y);
    y += 4;
    line();

    // ── Project Information ───────────────────────────
    sectionTitle("Project Information");
    row("Client", p.client_name);
    row("Director", p.director_name);
    row("Manager", p.manager_name);
    row("Start Date", p.start_date?.slice(0, 10));
    row("End Date", p.end_date?.slice(0, 10) ?? "Ongoing");
    row("Status", p.status);

    // ── Budget Overview ───────────────────────────────
    sectionTitle("Budget Overview");
    row("Planned Budget", `PKR ${Number(planned).toLocaleString()}`);
    row("Labour Budget", `PKR ${Number(p.labour_cost).toLocaleString()}`);
    row("Material Budget", `PKR ${Number(p.material_cost).toLocaleString()}`);
    row("Equipment Budget", `PKR ${Number(p.equipment_rent).toLocaleString()}`);
    row(
      "Subcontractor Budget",
      `PKR ${Number(p.subcontractor_cost).toLocaleString()}`,
    );
    row("Actual Expenses", `PKR ${actual.toLocaleString()}`);
    row(
      isProfit ? "Remaining Budget" : "Over Budget",
      `PKR ${Math.abs(variance).toLocaleString()}`,
    );

    // ── Actual Expenses ───────────────────────────────
    if (report.expenses.length > 0) {
      sectionTitle("Actual Expenses");
      tableHeader(["Category", "Amount"], [80, 80]);
      report.expenses.forEach((e) => {
        tableRow(
          [e.category, `PKR ${Number(e.total).toLocaleString()}`],
          [80, 80],
        );
      });
      tableRow(["TOTAL", `PKR ${actual.toLocaleString()}`], [80, 80]);
    }

    // ── Workers ───────────────────────────────────────
    // PDF function ke andar Workers wala section update karein
    if (report.workers.length > 0) {
      sectionTitle(`HR Allocations (${report.workers.length})`);
      tableHeader(
        ["Category", "Type", "Qty", "Start", "End", "Amount"],
        [40, 30, 15, 25, 25, 35],
      );
      report.workers.forEach((w) => {
        tableRow(
          [
            w.category_name,
            w.category_type,
            w.quantity,
            w.start_date?.slice(0, 10) ?? "—",
            w.end_date?.slice(0, 10) ?? "—",
            w.total_amount
              ? `PKR ${Number(w.total_amount).toLocaleString()}`
              : "0",
          ],
          [40, 30, 15, 25, 25, 35],
        );
      });
    }

    // ── Equipment ─────────────────────────────────────
    if (report.equipment.length > 0) {
      sectionTitle(`Equipment (${report.equipment.length})`);
      tableHeader(
        ["Name", "Category", "Ownership", "Start", "End"],
        [40, 35, 30, 25, 25],
      );
      report.equipment.forEach((e) => {
        tableRow(
          [
            e.name,
            e.category,
            e.ownership_type,
            e.start_date?.slice(0, 10),
            e.end_date?.slice(0, 10) ?? "Active",
          ],
          [40, 35, 30, 25, 25],
        );
      });
    }

    // ── Materials ─────────────────────────────────────
    if (report.materials.length > 0) {
      sectionTitle(`Materials (${report.materials.length})`);
      tableHeader(
        ["Material", "Quantity", "Unit", "Supplier"],
        [45, 30, 25, 55],
      );
      report.materials.forEach((m) => {
        tableRow(
          [m.material, m.quantity, m.unit, m.supplier],
          [45, 30, 25, 55],
        );
      });
    }

    // ── Subcontractors ────────────────────────────────
    if (report.subcontractors.length > 0) {
      sectionTitle(`Subcontractors (${report.subcontractors.length})`);
      tableHeader(
        ["Name", "Category", "Contract Price", "Payment"],
        [45, 40, 40, 30],
      );
      report.subcontractors.forEach((s) => {
        tableRow(
          [
            s.name,
            s.category,
            `PKR ${Number(s.price).toLocaleString()}`,
            s.payment_status,
          ],
          [45, 40, 40, 30],
        );
      });
    }

    doc.save(`${p.project_name}-report.pdf`);
  };

  return (
    <div className="dashboard" id="report-content">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "8px",
        }}
      >
        <button className="btn-outline no-print" onClick={handleBack}>
          Back
        </button>
        <div style={{ flex: 1 }}>
          <p
            style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "2px" }}
          >
            Project Report
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>
            {p.project_name}
          </h2>
        </div>
        <StatusBadge status={p.status} />
        <button className="btn-primary no-print" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      {/* Project Info */}
      <Section title="Project Information">
        <div className="info-grid">
          <InfoRow label="Client" value={p.client_name} />
          <InfoRow label="Director" value={p.director_name} />
          <InfoRow label="Manager" value={p.manager_name} />
          <InfoRow label="Start Date" value={p.start_date?.slice(0, 10)} />
          <InfoRow
            label="End Date"
            value={p.end_date?.slice(0, 10) ?? "Ongoing"}
          />
          <InfoRow label="Status" value={p.status} />
        </div>
      </Section>

      {/* Budget Overview */}
      <Section title="Budget Overview">
        <div className="stat-grid" style={{ padding: "16px" }}>
          <div className="stat-card" style={{ borderTop: "3px solid #0a7073" }}>
            <p className="stat-label">Planned Budget</p>
            <p className="stat-value" style={{ color: "#0a7073" }}>
              PKR {Number(planned).toLocaleString()}
            </p>
          </div>
          <div className="stat-card" style={{ borderTop: "3px solid #2563eb" }}>
            <p className="stat-label">Labour Budget</p>
            <p className="stat-value" style={{ color: "#2563eb" }}>
              PKR {Number(p.labour_cost).toLocaleString()}
            </p>
          </div>
          <div className="stat-card" style={{ borderTop: "3px solid #9333ea" }}>
            <p className="stat-label">Material Budget</p>
            <p className="stat-value" style={{ color: "#9333ea" }}>
              PKR {Number(p.material_cost).toLocaleString()}
            </p>
          </div>
          <div className="stat-card" style={{ borderTop: "3px solid #d97706" }}>
            <p className="stat-label">Equipment Budget</p>
            <p className="stat-value" style={{ color: "#d97706" }}>
              PKR {Number(p.equipment_rent).toLocaleString()}
            </p>
          </div>
          <div className="stat-card" style={{ borderTop: "3px solid #0891b2" }}>
            <p className="stat-label">Subcontractor Budget</p>
            <p className="stat-value" style={{ color: "#0891b2" }}>
              PKR {Number(p.subcontractor_cost).toLocaleString()}
            </p>
          </div>
          <div
            className="stat-card"
            style={{
              borderTop: `3px solid ${isProfit ? "#16a34a" : "#dc2626"}`,
            }}
          >
            <p className="stat-label">
              {isProfit ? "Remaining" : "Over Budget"}
            </p>
            <p
              className="stat-value"
              style={{ color: isProfit ? "#16a34a" : "#dc2626" }}
            >
              PKR {Math.abs(variance).toLocaleString()}
            </p>
          </div>
        </div>
      </Section>

      {/* Actual Expenses */}
      <Section title="Actual Expenses">
        {report.expenses.length === 0 ? (
          <p className="empty">No expenses recorded.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {report.expenses.map((e, i) => (
                <tr key={i}>
                  <td style={{ textTransform: "capitalize" }}>{e.category}</td>
                  <td style={{ fontWeight: 600 }}>
                    PKR {Number(e.total).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr style={{ background: "#f8fafc" }}>
                <td style={{ fontWeight: 700 }}>Total Actual</td>
                <td style={{ fontWeight: 700, color: "#dc2626" }}>
                  PKR {actual.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Section>

      {/* Workers */}
      {/* Workers / HR Allocations Section */}
      <Section title={`HR Allocations (${report.workers.length})`}>
        {report.workers.length === 0 ? (
          <p className="empty">No HR allocations found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.workers.map((w, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{w.category_name}</td>
                  <td>{w.category_type}</td>
                  <td>{w.quantity}</td>
                  <td>{w.start_date?.slice(0, 10) ?? "—"}</td>
                  <td>{w.end_date?.slice(0, 10) ?? "Active"}</td>
                  <td style={{ fontWeight: 600 }}>
                    {w.total_amount
                      ? `PKR ${Number(w.total_amount).toLocaleString()}`
                      : "Pending"}
                  </td>
                  <td>
                    <StatusBadge status={w.request_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* Equipment */}
      <Section title={`Equipment (${report.equipment.length})`}>
        {report.equipment.length === 0 ? (
          <p className="empty">No equipment allocated.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Ownership</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.equipment.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{e.name}</td>
                  <td>{e.category}</td>
                  <td>{e.ownership_type}</td>
                  <td>{e.start_date?.slice(0, 10)}</td>
                  <td>{e.end_date?.slice(0, 10) ?? "Active"}</td>
                  <td>
                    <StatusBadge status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* Materials */}
      <Section title={`Materials (${report.materials.length})`}>
        {report.materials.length === 0 ? (
          <p className="empty">No materials allocated.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {report.materials.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{m.material}</td>
                  <td>{m.quantity}</td>
                  <td>{m.unit}</td>
                  <td>{m.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* Subcontractors */}
      <Section title={`Subcontractors (${report.subcontractors.length})`}>
        {report.subcontractors.length === 0 ? (
          <p className="empty">No subcontractors allocated.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Contract Price</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {report.subcontractors.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.category}</td>
                  <td>PKR {Number(s.price).toLocaleString()}</td>
                  <td>
                    <StatusBadge status={s.payment_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}
