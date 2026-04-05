import { useState, useEffect } from "react";
import { subcontractorAPI } from "../api/axios";
import AssignSubModal from "./AssignSubModal";
import "./SubDashboard.css";
export default function SubDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null); // Modal handle karne ke liye
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const res = await subcontractorAPI.getPendingRequests();
      setRequests(res.data.data);
    } catch (err) { console.error("Error loading sub-requests", err); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="table-box">
        <div className="header-flex">
          <h2>Subcontractor Requests</h2>
          <p>Assign qualified firms to pending project tasks</p>
        </div>

        {loading ? <p>Loading requests...</p> : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Work Category</th>
                <th>Requested By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.project_name}</td>
                  <td><span className="badge">{req.category_name}</span></td>
                  <td>{req.requested_by}</td>
                  <td>
                    <button className="btn-primary" onClick={() => setSelectedReq(req)}>
                      Assign Firm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal logic niche wale component mein hai */}
      {selectedReq && (
        <AssignSubModal 
          request={selectedReq} 
          onClose={() => setSelectedReq(null)} 
          onSuccess={() => { setSelectedReq(null); loadRequests(); }}
        />
      )}
    </div>
  );
}