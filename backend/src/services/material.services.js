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
// Manual Shipment ke andar ye change karein
export const CreateManualShipment = async (categoryId, supplierId, quantity, pricePerUnit, userId) => {
  const totalPrice = quantity * pricePerUnit;

  // 1. Shipment table mein entry (4 params)
  const shipment = await repo.AddMaterialShipment(categoryId, supplierId, quantity, totalPrice);

  // 2. Supplier ka account dhoondo
  const supplierResult = await repo.GetSupplierAccount(supplierId);
  const supplier = supplierResult[0];
  
  // 3. Expense Category ID lo
  const materialExpenseId = await repo.GetMaterialExpenseCategoryId();
  
  // 4. Payment Request table mein entry (5 params: project, category, receiver, user, amount)
  await repo.CreatePaymentRequest(null, materialExpenseId, supplier.account_id, userId, totalPrice);

  return { success: true, shipmentId: shipment.insertId };
};

/**
 * SMART APPROVAL LOGIC
 * Triggered when approving a Project Manager's request.
 */
export const ApproveMaterialRequest = async (data) => {
  // 1. userId ko bhi destructure karein
  const { requestId, categoryId, projectId, requestedQty, supplierId, pricePerUnit, userId } = data;

  const inventory = await repo.GetCurrentAmountOfMaterial();
  const material = inventory.find(m => m.id === categoryId);
  const currentStock = material ? material.total_stock : 0;

  // 2. SHIPMENT BRANCH: 'userId' lazmi bhejni hai
  if (currentStock < requestedQty) {
    const neededAmount = requestedQty - currentStock;
    await CreateManualShipment(categoryId, supplierId, neededAmount, pricePerUnit, userId);
  }

  // material.services.js - ApproveMaterialRequest function ke andar
// Step 3: ALLOCATION
await repo.CreateMaterialAllocation(projectId, categoryId, requestId, requestedQty); 
// Ab sirf 4 params bhej rahe hain

  // 4. FINAL FINANCE: 5 parameters pure karein (ProjectID, ExpID, Recipient, UserID, Amount)
  // 4. FINAL FINANCE: 5 parameters pure karein
  const [supplier] = await repo.GetSupplierAccount(supplierId);
  if (!supplier || !supplier.account_id) {
      throw new Error("Supplier account not found for payment request");
  }
  // material.services.js
const materialExpenseId = await repo.GetMaterialExpenseCategoryId(); 
// Agar ye null hai, to Payment_Request fail ho jayegi

if (!materialExpenseId) {
    console.error("ERROR: Material Expense Category not found in Expense_Category table!");
    // Isay fix karne ke liye DB mein 'Material' naam ki category honi chahiye
}
  const totalBill = requestedQty * pricePerUnit;

// Order check karein: projectId, categoryId, supplierAccountId, userId, totalBill
  await repo.CreatePaymentRequest(
    projectId, 
    materialExpenseId, 
    supplier.account_id, 
    userId, 
    totalBill
  );
  // 5. UPDATE STATUS
  await repo.UpdateMaterialRequestStatus(requestId, 'Approved');

  return { success: true, message: "Manual shipment processed and project allocation approved." };
};