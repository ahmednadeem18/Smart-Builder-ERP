import { useState, useEffect } from "react";
import { materialAPI } from "../api/axios";
import "./ApproveBatchModal.css";

export default function ApproveBatchModal({ request, onClose, onSuccess }) {
  const [batches, setBatches] = useState([]);
  const [mode, setMode] = useState("check"); // check, approve, restock
  const [shipmentForm, setShipmentForm] = useState({ supplierId: "", price: "" });

  useEffect(() => {
    materialAPI.getBatches({ categoryId: request.category_id, requestedQty: request.quantity })
      .then(res => {
        if (res.data.data.length > 0) {
          setBatches(res.data.data);
          setMode("approve");
        } else {
          setMode("restock");
        }
      });
  }, [request]);

  const handleApprove = async (batchId) => {
    await materialAPI.approveBatch({ requestId: request.id, inventoryId: batchId, approvedQty: request.quantity });
    alert("Batch Allocated & Dispatch Started!");
    onSuccess();
  };

  const handleShipment = async (e) => {
    e.preventDefault();
    await materialAPI.createShipment({ categoryId: request.category_id, quantity: request.quantity, ...shipmentForm });
    alert("New Shipment Created! Stock Updated.");
    onSuccess();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Fulfillment: {request.category_name}</h3>
          <button className="close-x" onClick={onClose}>×</button>
        </div>

        {mode === "approve" && (
          <div className="batch-selection">
            <p>Select a specific batch with sufficient stock ({request.quantity} units needed):</p>
            {batches.map(b => (
              <div className="batch-row" key={b.id}>
                <div className="batch-info">
                  <strong>Batch ID: {b.id}</strong>
                  <span>Available: {b.available_qty} {request.unit}</span>
                </div>
                <button className="select-btn" onClick={() => handleApprove(b.id)}>Allocate</button>
              </div>
            ))}
          </div>
        )}

        {mode === "restock" && (
          <form className="restock-form" onSubmit={handleShipment}>
            <div className="alert-warning">⚠️ No single batch found with {request.quantity} units. Manual Shipment required.</div>
            <div className="input-group">
              <label>Select Preferred Supplier</label>
              <select required onChange={e => setShipmentForm({...shipmentForm, supplierId: e.target.value})}>
                <option value="">-- Choose Supplier --</option>
                <option value="1">Lucky Cement Ltd</option>
                <option value="2">Mughal Steel</option>
              </select>
            </div>
            <div className="input-group">
              <label>Agreed Unit Price (PKR)</label>
              <input type="number" required onChange={e => setShipmentForm({...shipmentForm, price: e.target.value})} />
            </div>
            <button type="submit" className="ship-btn">Create Shipment & Add to Stock</button>
          </form>
        )}

        <div className="modal-footer">
          <button className="cancel-link" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}