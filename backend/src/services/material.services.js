import * as repo from '../repositories/material.repository.js';

// --- VIEW OPERATIONS ---

export const GetCurrentAmountOfMaterial = async () => {
  return await repo.GetCurrentAmountOfMaterial();
};

export const GetAllShipments = async () => {
  return await repo.GetAllShipments();
};

export const GetAllSuppliers = async () => {
  return await repo.GetAllSuppliers();
};

export const GetPendingRequests = async () => {
  return await repo.GetPendingMaterialRequests();
};

// --- CORE ACTION LOGIC ---

/**
 * MANUAL SHIPMENT LOGIC
 * Triggered when the Manager clicks "Add Stock" manually.
 */
export const CreateManualShipment = async (categoryId, supplierId, quantity, pricePerUnit) => {
  const totalPrice = quantity * pricePerUnit;

  // 1. Record the shipment (DB Trigger automatically INCREASES inventory)
  const shipment = await repo.AddMaterialShipment(categoryId, supplierId, quantity, totalPrice);

  // 2. Generate Payment Request for the Supplier
  const [supplier] = await repo.GetSupplierAccount(supplierId);
  const materialExpenseId = await repo.GetMaterialExpenseCategoryId();
  
  // Note: For manual restock, projectId might be null or a 'Warehouse' project ID
  await repo.CreatePaymentRequest(null, materialExpenseId, supplier.account_id, totalPrice);

  return { success: true, shipmentId: shipment.insertId };
};

/**
 * SMART APPROVAL LOGIC
 * Triggered when approving a Project Manager's request.
 */
export const ApproveMaterialRequest = async (data) => {
  const { requestId, categoryId, projectId, requestedQty, supplierId, pricePerUnit } = data;

  // 1. Check existing Stock levels
  const inventory = await repo.GetCurrentAmountOfMaterial();
  const material = inventory.find(m => m.id === categoryId);
  const currentStock = material ? material.total_stock : 0;

  // 2. SHIPMENT BRANCH: If stock is low, make a manual shipment first
  if (currentStock < requestedQty) {
    const neededAmount = requestedQty - currentStock;
    await CreateManualShipment(categoryId, supplierId, neededAmount, pricePerUnit);
  }

  // 3. ALLOCATION: Move material to project (DB Trigger automatically DECREASES inventory)
  await repo.CreateMaterialAllocation(projectId, categoryId, requestId, requestedQty);

  // 4. FINAL FINANCE: Create payment request for the allocation amount
  const [supplier] = await repo.GetSupplierAccount(supplierId);
  const materialExpenseId = await repo.GetMaterialExpenseCategoryId();
  const totalBill = requestedQty * pricePerUnit;

  await repo.CreatePaymentRequest(projectId, materialExpenseId, supplier.account_id, totalBill);

  // 5. UPDATE STATUS
  await repo.UpdateMaterialRequestStatus(requestId, 'Approved');

  return { success: true, message: "Manual shipment processed and project allocation approved." };
};