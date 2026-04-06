// MaterialManagerDashboard.js
import { useState, useEffect } from "react";
import { materialAPI } from "../api/axios";
import RequestDetailModal from "./ApproveBatchModal";
import "./MaterialDashboard.css";

export default function MaterialManagerDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const res = await materialAPI.getPendingRequests();
      console.log("Pending requests:", res.data);
      // Handle different response structures
      const data = res.data?.data || res.data || [];
      setRequests(data);
    } catch (err) {
      console.error("Error loading material requests", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="table-box">
        <div className="header-flex">
          <h2>Material Requests</h2>
          <p>Click on any request to view inventory and allocate material</p>
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No pending requests found.</p>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Material Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Requested By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.requestId}>
                  <td>{req.project_name}</td>
                  <td><span className="badge">{req.category_name}</span></td>
                  <td><strong>{req.quantity}</strong></td>
                  <td>{req.unit}</td>
                  <td>{req.requested_by}</td>
                  <td>
                    <button 
                      className="btn-primary" 
                      onClick={() => setSelectedRequest(req)}
                    >
                      View & Allocate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={() => {
            setSelectedRequest(null);
            loadPendingRequests();
          }}
        />
      )}
    </div>
  );
}