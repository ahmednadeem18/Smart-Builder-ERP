import db from '../../config/db.js'
import { ExecuteQuery } from '../../utils/queryhandler.js';

// --- VIEW QUERIES ---

// 1. Manager jab request par click karega, to usey ye rows dikhengi
export const GetAvailableInventoryBatches = async (categoryId, requestedQty) => {
  const query = `
    SELECT 
        mi.id AS inventory_id, 
        mi.shipment_id, 
        mi.quantity AS available_quantity, 
        s.name AS supplier_name, 
        s.id AS supplier_id,
        (ms.price / ms.quantity) AS unit_price
    FROM Material_Inventory mi
    JOIN Material_Shipment ms ON mi.shipment_id = ms.id
    JOIN Supplier s ON ms.supplier_id = s.id
    WHERE mi.category_id = ? AND mi.quantity >= ?
    ORDER BY ms.id ASC;`; // FIFO: Purana maal pehle nazar aaye
  return await ExecuteQuery(query, [categoryId, requestedQty]);
};

export const GetPendingMaterialRequests = async () => {
  const query = `
    SELECT 
        mar.id AS requestId, 
        p.project_name, 
        p.id AS project_id,
        mc.id AS category_id, 
        mc.name AS category_name, 
        mc.unit, 
        mar.quantity,
        u.username AS requested_by
    FROM Material_Allocation_Request mar
    JOIN Project p ON mar.project_id = p.id
    JOIN Material_Category mc ON mar.category_id = mc.id
    JOIN User u ON mar.user_id = u.id
    WHERE mar.status = 'Pending';`;
  return await ExecuteQuery(query);
};

// --- ACTION QUERIES ---
// PM ki taraf se naya request generate karna
export const CreateMaterialAllocationRequest = async (projectId, categoryId, quantity, userId) => {
  const query = `
    INSERT INTO Material_Allocation_Request (project_id, category_id, quantity, user_id, status)
    VALUES (?, ?, ?, ?, 'Pending');`;
  return await ExecuteQuery(query, [projectId, categoryId, quantity, userId]);
};
// 2. Agar koi row pasand nahi aayi ya stock kam hai, to naya shipment
export const CreateShipmentAndInventory = async (categoryId, supplierId, quantity, price) => {
  // Pehle Shipment record
  const shipmentQuery = `
    INSERT INTO Material_Shipment (category_id, supplier_id, quantity, price, payment_status)
    VALUES (?, ?, ?, ?, 'Pending');`;
  const shipment = await ExecuteQuery(shipmentQuery, [categoryId, supplierId, quantity, price]);

  // Phir Inventory mein nayi row
  const inventoryQuery = `
    INSERT INTO Material_Inventory (category_id, shipment_id, quantity) 
    VALUES (?, ?, ?);`;
  await ExecuteQuery(inventoryQuery, [categoryId, shipment.insertId, quantity]);

  return shipment;
};

// 3. Final Action: Specific Inventory row se mal nikalna aur allocate karna
export const AllocateFromInventoryBatch = async (projectId, categoryId, requestId, supplierId, quantity, unitPrice, inventoryId) => {
  // A. Inventory table se quantity minus karein
  const deductQuery = `UPDATE Material_Inventory SET quantity = quantity - ? WHERE id = ?;`;
  await ExecuteQuery(deductQuery, [quantity, inventoryId]);

  // B. Allocation record create karein (Sirf wahi columns jo aapke DB mein hain)
  const allocationQuery = `
    INSERT INTO Material_Allocation (project_id, category_id, request_id, supplier_id, quantity)
    VALUES (?, ?, ?, ?, ?);`;
  
  // Note: unitPrice aur status hum yahan se hata rahe hain kyunki table mein nahi hain
  return await ExecuteQuery(allocationQuery, [projectId, categoryId, requestId, supplierId, quantity]);
};

export const UpdateMaterialRequestStatus = async (requestId, status) => {
  const query = `UPDATE Material_Allocation_Request SET status = ? WHERE id = ?;`;
  return await ExecuteQuery(query, [status, requestId]);
};

// --- FINANCE HELPERS ---

export const GetSupplierAccount = async (supplierId) => {
  const query = `SELECT account_id FROM Supplier WHERE id = ?;`;
  const result = await ExecuteQuery(query, [supplierId]);
  return result[0]?.account_id; 
};

export const GetMaterialExpenseCategoryId = async () => {
  const query = `SELECT id FROM Expense_Category WHERE name = 'material';`;
  const result = await ExecuteQuery(query);
  return result[0]?.id;
};

export const CreatePaymentRequest = async (projectId, expenseCategoryId, receiverAccountId, userId, amount) => {
  const query = `
    INSERT INTO Payment_Request (project_id, category_id, receiver_id, user_id, amount, status, date)
    VALUES (?, ?, ?, ?, ?, 'Requested', CURDATE());`;
  return await ExecuteQuery(query, [projectId, expenseCategoryId, receiverAccountId, userId, amount]);
};

export const GetAllSuppliers = async () => {
  const query = `SELECT id, name, contact_person FROM Supplier;`;
  return await ExecuteQuery(query);
};