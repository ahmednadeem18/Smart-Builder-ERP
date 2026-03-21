import db from '../../config/db.js'
import { ExecuteQuery } from '../../utils/queryhandler.js';

/* Fetch all recorded expenses including project details and category names.
*/
export const GetAllExpenses = async () => {
  const query = `
  SELECT 
    e.id, 
    p.project_name, 
    ec.name AS category, 
    e.amount, 
    e.date, 
    e.request_id 
  FROM Expense e
  JOIN Project p ON e.project_id = p.id
  JOIN Expense_Category ec ON e.category_id = ec.id
  ORDER BY e.date DESC;`;
  return ExecuteQuery(query);
}

/* Fetch all recorded revenues including project names and client names.
*/
export const GetAllRevenues = async () => {
  const query = `
  SELECT 
    r.id, 
    p.project_name, 
    c.name AS client_name, 
    r.amount, 
    r.rev_date, 
    r.request_id 
  FROM Revenue r
  JOIN Project p ON r.project_id = p.id
  JOIN Client c ON r.client_id = c.id
  ORDER BY r.rev_date DESC;`;
  return ExecuteQuery(query);
}

/* Fetch a specific Payment Request to verify it before approving.
*/
export const GetPaymentRequestById = async (requestId) => {
  const query = `
  SELECT * FROM Payment_Request WHERE id = ?;`;
  return ExecuteQuery(query, [requestId]);
}

/* Create a new Expense entry.
  This is called after a Finance Manager approves a Payment Request.
*/
export const CreateExpense = async (projectId, categoryId, requestId, amount, date) => {
  const query = `
  INSERT INTO Expense (project_id, category_id, request_id, amount, date) 
  VALUES (?, ?, ?, ?, ?);`;
  return ExecuteQuery(query, [projectId, categoryId, requestId, amount, date]);
}

/* Update status of Payment Request to 'Approved'
*/
export const UpdatePaymentRequestStatus = async (requestId, status) => {
  const query = `UPDATE Payment_Request SET status = ? WHERE id = ?;`;
  return ExecuteQuery(query, [status, requestId]);
}

/* Fetch all Payment Requests that are currently in 'Requested' status.
*/
export const GetAllPendingPayments = async () => {
  const query = `
  SELECT 
    pr.id AS payment_request_id,
    p.project_name,
    ec.name AS expense_category,
    pr.amount,
    pr.date,
    pr.status,
    u.username AS requested_by,
    ad.bank_name,
    ad.holder_name,
    ad.IBAN
  FROM Payment_Request pr
  JOIN Project p ON pr.project_id = p.id
  JOIN Expense_Category ec ON pr.category_id = ec.id
  JOIN User u ON pr.user_id = u.id
  LEFT JOIN Account_Details ad ON pr.receiver_id = ad.id
  WHERE pr.status = 'Requested'
  ORDER BY pr.date ASC;`;
  
  return ExecuteQuery(query);
}

/* Fetch all Invoice Requests that are currently in 'Requested' status.
*/
export const GetAllPendingInvoices = async () => {
  const query = `
  SELECT 
    ir.id, 
    p.project_name, 
    c.name AS client_name, 
    u.username AS requested_by, 
    ir.amount, 
    ir.req_date, 
    ir.status
  FROM Invoice_Request ir
  JOIN Project p ON ir.project_id = p.id
  JOIN Client c ON ir.client_id = c.id
  JOIN User u ON ir.user_id = u.id
  WHERE ir.status = 'Requested'
  ORDER BY ir.req_date ASC;`;
  
  return ExecuteQuery(query);
}

/* Update the status of an Invoice Request.
*/
export const UpdateInvoiceStatus = async (invoiceId, status) => {
  const query = `
  UPDATE Invoice_Request 
  SET status = ? 
  WHERE id = ?;`;
  
  return ExecuteQuery(query, [status, invoiceId]);
}

/* Create a Revenue entry.
*/
export const CreateRevenueEntry = async (projectId, clientId, requestId, amount) => {
  const query = `
  INSERT INTO Revenue (project_id, client_id, request_id, rev_date, amount)
  VALUES (?, ?, ?, CURDATE(), ?);`;
  
  return ExecuteQuery(query, [projectId, clientId, requestId, amount]);
}

