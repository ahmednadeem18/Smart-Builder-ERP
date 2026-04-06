import { useState } from "react";
import { hrAPI } from "../api/axios";

export default function HRApprovalModal({ request, onClose, onSuccess }) {
  const [days, setDays] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend expects: requestId, projectId, categoryId, categoryType, quantity, days
      await hrAPI.approveRequest({
        requestId: request.requestId,
        projectId: request.project_id,
        categoryId: request.category_id,
        categoryType: request.category_type,
        quantity: request.quantity,
        days: days
      });
      alert("Labour Allocated Successfully!");
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Allocation Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hr-modal-overlay">
      <div className="hr-modal">
        <h3>Approve Resource Allocation</h3>
        <div className="req-summary">
          <p>Request for <strong>{request.quantity} {request.category_name} ({request.category_type})</strong></p>
          <p>Project: {request.project_name}</p>
        </div>

        <form onSubmit={handleApprove}>
          <div className="form-group">
            <label>Allocation Duration (Days)</label>
            <input 
              type="number" 
              min="1" 
              required 
              value={days} 
              onChange={(e) => setDays(e.target.value)} 
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-link" onClick={onClose}>Cancel</button>
            <button type="submit" className="confirm-btn" disabled={submitting}>
              {submitting ? "Allocating..." : "Confirm Allocation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}