import { useState, useEffect, useCallback } from "react";
import { equipmentAPI } from "../api/axios";
import "./EquipmentDashboard.css";

export default function EquipmentDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = activeTab === "pending" 
        ? await equipmentAPI.getPendingRequests() 
        : await equipmentAPI.getActiveAllocations();
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (req) => {
    const d = days[req.requestId];
    if (!d || d < 1) return alert("Enter days");
    try {
      await equipmentAPI.approveRequest({
        requestId: req.requestId,
        projectId: req.project_id,
        categoryId: req.category_id,
        days: d
      });
      alert("Allocated!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleRelease = async (id) => {
    if (!window.confirm("Release this?")) return;
    try {
      await equipmentAPI.releaseEquipment({ equipmentId: id });
      fetchData();
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className="eq-container">
      <header className="eq-header">
        <h1>Equipment Management</h1>
        <button className="approve-btn" onClick={fetchData}>Refresh</button>
      </header>

      <div className="eq-tabs">
        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>Pending Requests</button>
        <button className={activeTab === "active" ? "active" : ""} onClick={() => setActiveTab("active")}>In-Use Inventory</button>
      </div>

      <div className="eq-card">
        {loading ? <p>Loading...</p> : (
          <table className="eq-table">
            <thead>
              {activeTab === "pending" ? (
                <tr><th>Project</th><th>Category</th><th>Requested By</th><th>Action</th></tr>
              ) : (
                <tr><th>Equipment</th><th>Project</th><th>Type</th><th>End Date</th><th>Action</th></tr>
              )}
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.requestId || item.allocation_id}>
                  {activeTab === "pending" ? (
                    <>
                      <td>{item.project_name}</td>
                      <td>{item.category_name}</td>
                      <td>{item.requested_by}</td>
                      <td>
                        <input 
                          type="number" 
                          className="days-input" 
                          placeholder="Days"
                          onChange={(e) => setDays({...days, [item.requestId]: e.target.value})}
                        />
                        <button className="approve-btn" onClick={() => handleApprove(item)}>Approve</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.equipment_name}</td>
                      <td>{item.project_name}</td>
                      <td><span className={`badge ${item.ownership_type}`}>{item.ownership_type}</span></td>
                      <td>{new Date(item.end_date).toLocaleDateString()}</td>
                      <td>
                        <button className="release-btn" onClick={() => handleRelease(item.equipment_id)}>Release</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}