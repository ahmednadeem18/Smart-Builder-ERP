import { useState, useEffect } from "react";
import { materialAPI } from "../api/axios";
import "./ApproveBatchModal.css";

export default function MaterialFulfillmentModal({ request, onClose, onSuccess }) {
  const [batches, setBatches] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Shipment Form State with editable quantity
  const [shipmentData, setShipmentData] = useState({
    supplierId: "",
    pricePerUnit: "",
    shipmentQty: request.quantity // Defaulted to requested qty
  });

  useEffect(() => {
    fetchInitialData();
  }, [request]);

  const fetchInitialData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" }); // Reset message on load
    try {
      const batchRes = await materialAPI.getBatches({
        categoryId: request.category_id,
        requestedQty: request.quantity
      });
      // Sirf tab batches set karein agar data array ho
      setBatches(Array.isArray(batchRes.data.data) ? batchRes.data.data : []);

      const supRes = await materialAPI.getSuppliers();
      setSuppliers(supRes.data.data || []);
    } catch (err) {
      // Failed to load sirf tab dikhayein jab API fail ho
      setMessage({ type: "error", text: "Server connection failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (batchId) => {
    try {
      await materialAPI.approveBatch({
        requestId: request.requestId,
        categoryId: request.category_id,
        projectId: request.project_id,
        requestedQty: request.quantity,
        inventoryId: batchId
      });
      setMessage({ type: "success", text: "Material allocated successfully!" });
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setMessage({ type: "error", text: "Error during allocation." });
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    if (!shipmentData.supplierId) return alert("Please select a supplier");

    try {
      await materialAPI.createShipment({
        categoryId: request.category_id,
        supplierId: shipmentData.supplierId,
        quantity: shipmentData.shipmentQty, // Use custom qty
        pricePerUnit: shipmentData.pricePerUnit
      });
      setMessage({ type: "success", text: "Shipment created successfully!" });
      fetchInitialData(); // Refresh list
    } catch (err) {
      setMessage({ type: "error", text: "Failed to create shipment." });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Fulfill Material Request</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="request-summary">
          <div className="summary-grid">
            <div className="summary-item">
              <label>Project</label>
              <span>{request.project_name}</span>
            </div>
            <div className="summary-item">
              <label>Material</label>
              <span>{request.category_name}</span>
            </div>
            <div className="summary-item">
              <label>Requested Qty</label>
              <span>{request.quantity} {request.unit}</span>
            </div>
            <div className="summary-item">
              <label>Requested By</label>
              <span>{request.requested_by}</span>
            </div>
          </div>
        </div>

        {/* Message Banner (Sirf tab dikhayen jab text ho) */}
        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading Data...</div>
        ) : (
          <>
            <div className="inventory-section">
              <h3>Available Inventory Batches</h3>
              {batches.length > 0 ? (
                <div className="table-responsive">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Batch ID</th>
                        <th>Supplier</th>
                        <th>Available Qty</th>
                        <th>Unit Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((batch) => (
                        <tr key={batch.inventory_id}>
                          <td>#{batch.inventory_id}</td>
                          <td>{batch.supplier_name}</td>
                          <td>{batch.available_quantity}</td>
                          <td>PKR {batch.unit_price}</td>
                          <td>
                            <button className="approve-btn" onClick={() => handleApprove(batch.inventory_id)}>
                              Approve & Dispatch
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-inventory">
                  <p><strong>Stock Alert:</strong> No batch found with sufficient stock.</p>
                </div>
              )}
            </div>

            <div className="create-shipment-section">
              <h3>Create New Shipment</h3>
              <form className="shipment-form" onSubmit={handleCreateShipment}>
                <div className="form-group">
                  <label>Select Supplier</label>
                  <select 
                    required 
                    value={shipmentData.supplierId} // Controlled component
                    onChange={(e) => setShipmentData({...shipmentData, supplierId: e.target.value})}
                  >
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Order Quantity</label>
                  <input 
                    type="number" 
                    required 
                    min={request.quantity} // Kam se kam requested qty jitni ho
                    value={shipmentData.shipmentQty}
                    onChange={(e) => setShipmentData({...shipmentData, shipmentQty: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Unit Price (PKR)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="0.00"
                    value={shipmentData.pricePerUnit}
                    onChange={(e) => setShipmentData({...shipmentData, pricePerUnit: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <button type="submit" className="create-shipment-btn" style={{marginTop: '25px'}}>
                    Order {shipmentData.shipmentQty} units
                  </button>
                </div>
              </form>

              {shipmentData.pricePerUnit && shipmentData.shipmentQty && (
                <div className="total-preview">
                  Total Bill: PKR {(shipmentData.shipmentQty * shipmentData.pricePerUnit).toLocaleString()}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}