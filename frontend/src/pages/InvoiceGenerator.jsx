import { useEffect, useState } from "react";
import { adminAPI, clientAPI, financeAPI } from "../api/axios";
import { useAuth } from "../context/authcontext";
import jsPDF from "jspdf";

export default function InvoiceGenerator() {
  const { user }     = useAuth();
  const [projects,   setProjects]   = useState([]);
  const [clients,    setClients]    = useState([]);
  const [form,       setForm]       = useState({
    projectId: "", clientId: "", amount: "", description: ""
  });
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [lastInvoice, setLastInvoice] = useState(null);

  useEffect(() => {
    adminAPI.getProjects()
      .then(({ data }) => setProjects(data.data ?? []));
    clientAPI.getAll()
      .then(({ data }) => setClients(data.data ?? []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await financeAPI.createInvoice({
        projectId: Number(form.projectId),
        clientId:  Number(form.clientId),
        amount:    Number(form.amount),
      });

      const project = projects.find(p => p.id === Number(form.projectId));
      const client  = clients.find(c => c.id === Number(form.clientId));

      setLastInvoice({
        project,
        client,
        amount:      Number(form.amount),
        description: form.description,
        date:        new Date().toLocaleDateString("en-GB"),
        invoiceNo:   `INV-${Date.now()}`,
      });

      setSuccess("Invoice request created successfully.");
      setForm({ projectId: "", clientId: "", amount: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!lastInvoice) return;
    const doc  = new jsPDF("p", "mm", "a4");
    const left = 20;
    let y      = 20;

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", left, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${lastInvoice.invoiceNo}`, left, y);
    doc.text(`Date: ${lastInvoice.date}`, 140, y);
    y += 6;

    doc.setDrawColor(200);
    doc.line(left, y, 190, y);
    y += 8;

    // Company info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Smart Builder ERP", left, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Construction Management System", left, y);
    y += 12;

    // Bill to
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", left, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(lastInvoice.client?.name ?? "—", left, y);
    y += 5;
    doc.text(`Phone: ${lastInvoice.client?.phone_number ?? "—"}`, left, y);
    y += 12;

    // Project
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT:", left, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(lastInvoice.project?.project_name ?? "—", left, y);
    y += 12;

    // Line
    doc.line(left, y, 190, y);
    y += 8;

    // Description table
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Description", left, y);
    doc.text("Amount", 160, y);
    y += 4;
    doc.line(left, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(lastInvoice.description || "Construction Services", left, y);
    doc.text(`PKR ${lastInvoice.amount.toLocaleString()}`, 160, y);
    y += 10;

    doc.line(left, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.text("TOTAL AMOUNT DUE", left, y);
    doc.text(`PKR ${lastInvoice.amount.toLocaleString()}`, 160, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Status: Pending Approval", left, y);
    y += 5;
    doc.text("This invoice has been submitted for Finance Manager approval.", left, y);

    doc.save(`${lastInvoice.invoiceNo}.pdf`);
  };

  return (
    <div className="dashboard">

      <div className="page-header">
        <div>
          <h2 className="page-heading">Generate Invoice</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            Create an invoice request for a client
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

        {/* Form */}
        <div className="form-card">
          <h3 className="form-title">Invoice Details</h3>
          <form onSubmit={handleSubmit} className="project-form">

            <div className="form-group">
              <label>Project</label>
              <select name="projectId" value={form.projectId} onChange={handleChange}>
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.project_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Client</label>
              <select name="clientId" value={form.clientId} onChange={handleChange}>
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount (PKR)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter invoice amount"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Construction Services - Phase 1"
              />
            </div>

            {error   && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Invoice Request"}
            </button>

          </form>
        </div>

        {/* Preview / Download */}
        <div className="form-card">
          <h3 className="form-title">Invoice Preview</h3>
          {!lastInvoice ? (
            <p className="empty" style={{ marginTop: "40px" }}>
              Fill the form and create an invoice to see the preview here.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="info-row">
                <span className="info-label">Invoice No</span>
                <span className="info-value">{lastInvoice.invoiceNo}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date</span>
                <span className="info-value">{lastInvoice.date}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Project</span>
                <span className="info-value">{lastInvoice.project?.project_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Client</span>
                <span className="info-value">{lastInvoice.client?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Amount</span>
                <span className="info-value" style={{ color: "#0a7073", fontWeight: 700 }}>
                  PKR {lastInvoice.amount.toLocaleString()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span style={{ color: "#d97706", background: "#fffbeb", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
                  Pending Approval
                </span>
              </div>
              <button
                className="btn-primary"
                onClick={handleDownloadInvoice}
                style={{ marginTop: "8px" }}
              >
                Download Invoice PDF
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}