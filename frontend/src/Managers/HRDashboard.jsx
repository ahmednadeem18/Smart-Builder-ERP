import { useState, useEffect, useCallback } from "react";
import { hrAPI } from "../api/axios";
import HRApprovalModal from "./HRApprovalModal";
import "./HRDashboard.css";

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [data, setData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  // Memoized fetchData to avoid unnecessary re-renders
  const fetchData = useCallback(async () => {
    setLoading(true);
    setData([]); // Clear old data to prevent UI flickering
    try {
      let res;
      if (activeTab === "requests") {
        res = await hrAPI.getPendingRequests();
      } else {
        res = await hrAPI.getAllAllocations();
      }
      
      // Ensure we are setting an array even if backend returns null
      const result = res.data?.data || res.data || [];
      setData(Array.isArray(result) ? result : []);
      
    } catch (err) {
      console.error("HR Data Fetch Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFreeLabour = async (allocationId, categoryType) => {
    if (!window.confirm("Bhai, kya aap waqai is labour ko free karna chahte hain?")) return;
    
    try {
      await hrAPI.freeLabour({ allocationId, categoryType });
      alert("Labor freed successfully!");
      fetchData(); // List refresh
    } catch (err) {
      alert(err.response?.data?.message || "Failed to free labor");
    }
  };

  return (
    <div className="hr-container">
      <header className="hr-header">
        <div className="title-area">
          <h1>HR Management</h1>
          <p>Personnel Allocation & Labor Pool Control</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </header>

      <div className="hr-tabs">
        <button 
          className={activeTab === "requests" ? "active" : ""} 
          onClick={() => setActiveTab("requests")}
        >
          Pending Requests
        </button>
        <button 
          className={activeTab === "allocations" ? "active" : ""} 
          onClick={() => setActiveTab("allocations")}
        >
          Active Allocations
        </button>
      </div>

      <div className="hr-card">
        {loading ? (
          <div className="hr-loader">
            <div className="spinner"></div>
            <p>Fetching {activeTab}...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="hr-table">
              <thead>
                {activeTab === "requests" ? (
                  <tr>
                    <th>Project Name</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Project Name</th>
                    <th>Resource / Category</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Cost</th>
                    <th>Action</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    // Use id if available, otherwise index as fallback
                    <tr key={item.id || `row-${index}`}>
                      {activeTab === "requests" ? (
                        <>
                          <td><strong>{item.project_name}</strong></td>
                          <td>{item.category_name}</td>
                          <td>
                            <span className={`badge ${item.category_type}`}>
                              {item.category_type}
                            </span>
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            <button 
                              className="alloc-btn" 
                              onClick={() => setSelectedReq(item)}
                            >
                              Allocate
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td><strong>{item.project_name}</strong></td>
                          <td>
                            <div className="cat-name-cell">{item.category_name}</div>
                            <span className={`badge ${item.category_type}`}>
                              {item.category_type}
                            </span>
                          </td>
                          <td>{new Date(item.start_date).toLocaleDateString('en-GB')}</td>
                          <td>{new Date(item.end_date).toLocaleDateString('en-GB')}</td>
                          <td className="cost-cell">PKR {item.total_amount?.toLocaleString()}</td>
                          <td>
                            <button 
                              className="free-btn" 
                              onClick={() => handleFreeLabour(item.id, item.category_type)}
                            >
                              Free Labour
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data-cell">
                      No active {activeTab} found in current records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReq && (
        <HRApprovalModal 
          request={selectedReq} 
          onClose={() => setSelectedReq(null)} 
          onSuccess={() => {
            setSelectedReq(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}