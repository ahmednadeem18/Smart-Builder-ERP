import { ExecuteQuery } from "../../utils/queryhandler.js";

// --- PM OPERATIONS ---

// PM request generate karta hai
export const CreateSubAllocationRequest = async (projectId, categoryId, userId) => {
    const query = `
        INSERT INTO Subcontractor_Allocation_Request (project_id, category_id, user_id, status)
        VALUES (?, ?, ?, 'Pending');`;
    return await ExecuteQuery(query, [projectId, categoryId, userId]);
};

// --- SM OPERATIONS ---

// SM ko dashboard ke liye pending requests dikhana
export const GetPendingSubRequests = async () => {
    const query = `
        SELECT 
            sar.id AS requestId, 
            sar.project_id, 
            sar.category_id, 
            p.project_name, 
            sc.name AS category_name,
            u.username AS requested_by
        FROM Subcontractor_Allocation_Request sar
        JOIN Project p ON sar.project_id = p.id
        JOIN Subcontractor_Category sc ON sar.category_id = sc.id
        JOIN User u ON sar.user_id = u.id
        WHERE sar.status = 'Pending';`;
    return await ExecuteQuery(query);
};

// Category ke mutabiq subcontractors dhoondna
export const GetSubcontractorsByCategory = async (categoryId) => {
    const query = `
        SELECT id, name, number, account_id 
        FROM Subcontractor 
        WHERE category_id = ?;`;
    return await ExecuteQuery(query, [categoryId]);
};

// Allocation table mein entry (SM action)
export const CreateSubAllocation = async (subcontractorId, projectId, requestId, price) => {
    const query = `
        INSERT INTO Subcontractor_Allocation (subcontractor_id, project_id, request_id, price, payment_status)
        VALUES (?, ?, ?, ?, 'Requested');`;
    return await ExecuteQuery(query, [subcontractorId, projectId, requestId, price]);
};

// Request ka status update karna
export const UpdateSubRequestStatus = async (requestId, status) => {
    const query = `UPDATE Subcontractor_Allocation_Request SET status = ? WHERE id = ?;`;
    return await ExecuteQuery(query, [status, requestId]);
};

// --- FINANCE HELPERS ---

// Subcontractor ka account_id nikalna
export const GetSubcontractorAccount = async (subId) => {
    const query = `SELECT account_id FROM Subcontractor WHERE id = ?;`;
    const result = await ExecuteQuery(query, [subId]);
    return result[0];
};

// Expense Category se 'subcontractor' ki ID nikalna
export const GetSubcontractorExpenseCategoryId = async () => {
    const query = `SELECT id FROM Expense_Category WHERE name = 'subcontractor';`;
    const result = await ExecuteQuery(query);
    return result[0]?.id;
};