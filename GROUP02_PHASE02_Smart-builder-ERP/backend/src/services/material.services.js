import * as repo from '../repositories/material.repository.js';

// 1. Action: Manager jab nayi shipment mangwaye ga
export const CreateManualShipment = async (data) => {
  const { categoryId, supplierId, quantity, pricePerUnit } = data;
  
  const totalPrice = quantity * pricePerUnit;
  const result = await repo.CreateShipmentAndInventory(categoryId, supplierId, quantity, totalPrice);
  
  return { 
    success: true, 
    message: "Nayi shipment inventory mein add ho gayi hai.",
    data: result 
  };
};

// 2. Action: Manager jab specific row ke aage 'Approve' dabaye ga
export const ApproveFromSpecificBatch = async (data) => {
  const { 
    requestId, 
    categoryId, 
    projectId, 
    requestedQty, 
    inventoryId, // Frontend se specific row ki ID aayegi
    userId       // Material Manager ki ID
  } = data;

  // A. Pehle supplier aur price ki details nikalain usi row se
  const inventoryRows = await repo.GetAvailableInventoryBatches(categoryId, requestedQty);
  const batch = inventoryRows.find(b => b.inventory_id === inventoryId);

  if (!batch) {
    const error = new Error("Selected inventory batch not found or insufficient quantity!");
    error.status = 404;
    throw error;
  }

  const { supplier_id, unit_price } = batch;

  // B. Specific batch se quantity minus karein aur allocation record banayein
  await repo.AllocateFromInventoryBatch(
    projectId, 
    categoryId, 
    requestId, 
    supplier_id, 
    requestedQty, 
    unit_price, 
    inventoryId
  );

  // C. FINANCE INTEGRATION: Bilal ko payment request bhejein
  const accountId = await repo.GetSupplierAccount(supplier_id);
  const expId = await repo.GetMaterialExpenseCategoryId();
  const totalCost = requestedQty * unit_price;

  if (!accountId) {
    const error = new Error("Supplier account missing!");
    error.status = 404;
    throw error;
  }

  await repo.CreatePaymentRequest(projectId, expId, accountId, userId, totalCost);

  // D. PM ki request status update karein
  await repo.UpdateMaterialRequestStatus(requestId, 'Approved');

  return { 
    success: true, 
    message: "Material allocated from selected batch and Finance notified." 
  };
};

// --- Helpers for Dashboard ---

export const GetInventoryBatches = async (categoryId, requestedQty) => {
  return await repo.GetAvailableInventoryBatches(categoryId, requestedQty);
};

export const GetPendingRequests = async () => {
  return await repo.GetPendingMaterialRequests();
};

export const GetSuppliers = async () => {
  return await repo.GetAllSuppliers();
};
// PM Request Service

export const CreateMaterialRequest = async (data) => {
  // 1. Data ko extract karein
  const { projectId, categoryId, quantity, userId } = data;

  // 2. Console log karein check karne ke liye (Optional)
  // console.log("Service Received:", { projectId, categoryId, quantity });

  // 3. Validation Check (Yahan ghalti ho sakti hai)
  if (!projectId || !categoryId || !quantity) {
    const error =  new Error("Missing required fields: projectId, categoryId, or quantity");
    error.status = 400;
    throw error;
  }

  const result = await repo.CreateMaterialAllocationRequest(projectId, categoryId, quantity, userId);
  
  return { 
    success: true, 
    requestId: result.insertId, 
    message: "Material request created successfully." 
  };
};