import { useState, useEffect } from "react";
import { materialAPI } from "../api/axios";
import ApproveBatchModal from "./ApproveBatchModal";
import "./MaterialDashboard.css";

export default function MaterialDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "requests") res = await materialAPI.getPendingRequests();
      else if (activeTab === "stock") res = await materialAPI.getStock();
      else if (activeTab === "shipments") res = await materialAPI.getShipments();
      setData(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="material-container">
      <div className="dashboard-header">
        <button className="back-btn" onClick={() => window.history.back()}>← Back</button>
        <div className="title-section">
          <h1>Material Control Center</h1>
          <p>Inventory Batch Allocation & Procurement</p>
        </div>
      </div>

      <div className="tabs-bar">
        <button className={activeTab === "requests" ? "tab active" : "tab"} onClick={() => setActiveTab("requests")}>Pending Requests</button>
        <button className={activeTab === "stock" ? "tab active" : "tab"} onClick={() => setActiveTab("stock")}>Live Inventory</button>
        <button className={activeTab === "shipments" ? "tab active" : "tab"} onClick={() => setActiveTab("shipments")}>Shipment Logs</button>
      </div>

      <div className="content-card">
        {loading ? <div className="loader">Updating Records...</div> : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                {activeTab === "requests" ? (
                  <tr><th>Project</th><th>Material</th><th>Qty</th><th>Site PM</th><th>Status</th><th>Action</th></tr>
                ) : activeTab === "stock" ? (
                  <tr><th>Category</th><th>Available Qty</th><th>Unit</th><th>Status</th></tr>
                ) : (
                  <tr><th>Supplier</th><th>Material</th><th>Qty Received</th><th>Date</th></tr>
                )}
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <tr key={i}>
                    {activeTab === "requests" && (
                      <>
                        <td>{item.project_name}</td>
                        <td><span className="tag blue">{item.category_name}</span></td>
                        <td><strong>{item.quantity}</strong></td>
                        <td>{item.requested_by}</td>
                        <td><span className="status-pending">Pending</span></td>
                        <td>
                          <button className="action-btn approve" onClick={() => setSelectedReq(item)}>Process Request</button>
                        </td>
                      </>
                    )}
                    {activeTab === "stock" && (
                      <>
                        <td>{item.category_name}</td>
                        <td className="qty-text">{item.total_quantity}</td>
                        <td>{item.unit}</td>
                        <td>{item.total_quantity > 0 ? <span className="tag green">In Stock</span> : <span className="tag red">Out of Stock</span>}</td>
                      </>
                    )}
                    {activeTab === "shipments" && (
                      <>
                        <td>{item.supplier_name}</td>
                        <td>{item.category_name}</td>
                        <td>{item.quantity}</td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReq && (
        <ApproveBatchModal 
          request={selectedReq} 
          onClose={() => setSelectedReq(null)} 
          onSuccess={() => { setSelectedReq(null); fetchData(); }}
        />
      )}
    </div>
  );
}