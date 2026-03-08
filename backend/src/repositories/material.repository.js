import db from '../../config/db.js'
import { ExecuteQuery } from '../../utils/queryhandler.js';

// --- VIEW QUERIES (Existing) ---

export const GetCurrentAmountOfMaterial = async () => {
  const query = `
    SELECT mc.id, mc.name, mc.unit, IFNULL(SUM(mi.quantity),0) AS total_stock
    FROM Material_Category mc
    LEFT JOIN Material_Inventory mi ON mc.id = mi.category_id
    GROUP BY mc.id;`;
  return await ExecuteQuery(query);
}

export const GetAllShipments = async () => {
  const query = `
    SELECT ms.id, mc.name AS material, mc.unit, s.name AS supplier, ms.quantity, ms.price, ms.payment_status
    FROM Material_Shipment ms
    JOIN Supplier s ON ms.supplier_id = s.id
    JOIN Material_Category mc ON ms.category_id = mc.id
    ORDER BY ms.id DESC;`;
  return await ExecuteQuery(query);
}

// --- ACTION QUERIES (New Additions) ---

/**
 * 1. Add Shipment: Use this when inventory is low.
 * Triggers in DB will automatically update Material_Inventory.
 */
export const AddMaterialShipment = async (categoryId, supplierId, quantity, price) => {
  const query = `
    INSERT INTO Material_Shipment (category_id, supplier_id, quantity, price, payment_status, date)
    VALUES (?, ?, ?, ?, 'Pending', CURDATE());`;
  return await ExecuteQuery(query, [categoryId, supplierId, quantity, price]);
};

/**
 * 2. Allocate Material: Moves stock to the project.
 * Triggers in DB will automatically subtract from Material_Inventory.
 */
export const CreateMaterialAllocation = async (projectId, categoryId, requestId, quantity) => {
  const query = `
    INSERT INTO Material_Allocation (project_id, category_id, request_id, quantity)
    VALUES (?, ?, ?, ?);`;
  return await ExecuteQuery(query, [projectId, categoryId, requestId, quantity]);
};

/**
 * 3. Update Request Status: Marks the PM's request as handled.
 */
export const UpdateMaterialRequestStatus = async (requestId, status) => {
  const query = `UPDATE Material_Allocation_Request SET status = ? WHERE id = ?;`;
  return await ExecuteQuery(query, [status, requestId]);
};

/**
 * 4. Finance Helper: Get Supplier Account for payment request.
 */
export const GetSupplierAccount = async (supplierId) => {
  const query = `SELECT account_id FROM Supplier WHERE id = ?;`;
  return await ExecuteQuery(query, [supplierId]);
};

/**
 * 5. Finance Helper: Create the actual payment request for the Finance Manager.
 */
export const CreatePaymentRequest = async (projectId, categoryId, accountId, amount) => {
  const query = `
    INSERT INTO Payment_Request (project_id, category_id, account_id, amount, status, date)
    VALUES (?, ?, ?, ?, 'Requested', CURDATE());`;
  return await ExecuteQuery(query, [projectId, categoryId, accountId, amount]);
};

/**
 * 6. Category Helper: Get the ID for 'Material' in Expense_Category table.
 */
export const GetMaterialExpenseCategoryId = async () => {
  const query = `SELECT id FROM Expense_Category WHERE name = 'Material';`;
  const result = await ExecuteQuery(query);
  return result[0]?.id;
};

/**
 * 7. Request Helper: Get all pending requests for the Material Manager dashboard.
 */
export const GetPendingMaterialRequests = async () => {
  const query = `
    SELECT mar.id, p.project_name, mc.id AS category_id, mc.name AS material, mc.unit, mar.quantity, p.id AS project_id
    FROM Material_Allocation_Request mar
    JOIN Project p ON mar.project_id = p.id
    JOIN Material_Category mc ON mar.category_id = mc.id
    WHERE mar.status = 'Pending';`;
  return await ExecuteQuery(query);
};
export const GetAllSuppliers = async () => {
  const query = `SELECT id, name, contact_person FROM Supplier;`;
  return await ExecuteQuery(query);
};