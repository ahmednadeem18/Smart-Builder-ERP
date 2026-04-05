import { useState, useEffect } from "react";
import { subcontractorAPI } from "../api/axios";
import "./assign.css";
export default function AssignSubModal({ request, onClose, onSuccess }) {
  const [firms, setFirms] = useState([]);
  const [form, setForm] = useState({
    subId: "",
    amount: "",
    startDate: "",
    endDate: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    subcontractorAPI.getByCategory(request.category_id)
      .then(res => setFirms(res.data.data))
      .catch(err => console.error(err));
  }, [request]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await subcontractorAPI.approve({
        requestId: request.id,
        projectId: request.project_id, // Required for Finance payment request
        ...form
      });
      alert("Subcontractor Assigned Successfully!");
      onSuccess();
    } catch (err) {
      alert("Error in allocation.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="login-box modal-box">
        <h3>Assign Firm</h3>
        <p className="sub-text">Task: {request.description}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subcontractor Firm</label>
            <select required onChange={(e) => setForm({...form, subId: e.target.value})}>
              <option value="">-- Select Firm --</option>
              {firms.map(f => <option key={f.id} value={f.id}>{f.name} (⭐ {f.rating})</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Contract Amount (PKR)</label>
            <input type="number" required placeholder="Total Amount" 
              onChange={(e) => setForm({...form, amount: e.target.value})} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" required onChange={(e) => setForm({...form, startDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" required onChange={(e) => setForm({...form, endDate: e.target.value})} />
            </div>
          </div>

          <div className="btn-row">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Processing..." : "Allocate & Notify Finance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}