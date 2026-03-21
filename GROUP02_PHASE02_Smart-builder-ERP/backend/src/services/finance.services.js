
import * as repo from '../repositories/finance.repository.js';

/*
Fetches all finalized expenses.*/
export const GetAllExpenses = async () => {
  return await repo.GetAllExpenses();
};

/*
Fetches all finalized revenues.*/
export const GetAllRevenues = async () => {
  return await repo.GetAllRevenues();
};

/*
Fetches the "To-Do List" for the Finance Manager. */
export const GetPendingPayments = async () => {
  return await repo.GetAllPendingPayments();
};

/*
Fetches all pending client invoices.
*/
export const GetPendingInvoices = async () => {
  return await repo.GetAllPendingInvoices();
};



/*
 APPROVE PAYMENT LOGIC
 Triggered when Finance Manager pays a worker, supplier, or renter.
 This converts a Payment_Request into an official Expense record.
 */
export const ApprovePaymentRequest = async (requestId) => {
  // 1. Fetch the original request to get its data
  const requestResult = await repo.GetPaymentRequestById(requestId);
  const request = requestResult[0];

  if (!request) {
    const error = new Error("Payment Request not found.");
    error.status = 404;
    throw error;
  }

  if (request.status === 'Approved') {
    const error = new Error("This payment has already been processed.");
    error.status = 400;
    throw error;
  }

  // 2. Create the Expense entry
  await repo.CreateExpense(
    request.project_id,
    request.category_id,
    requestId,
    request.amount,
    new Date() // Today's date
  );

  // 3. Update the request status
  await repo.UpdatePaymentRequestStatus(requestId, 'Approved');

  return { success: true, message: "Payment approved and recorded as an expense." };
};

/*
 APPROVE INVOICE LOGIC
 This converts an Invoice_Request into an official Revenue record.
 */
export const ApproveInvoiceRequest = async (invoiceId) => {
  // 1. Get invoice details (Need amount, project_id, and client_id)
  const invoiceResult = await repo.GetAllPendingInvoices(); 
  const invoice = invoiceResult.find(i => i.id === parseInt(invoiceId));

  if (!invoice) {
    const error = new Error("Invoice Request not found or already processed.");
    error.status = 404;
    throw error;
  }

  // 2. Create the Revenue entry
  await repo.CreateRevenueEntry(
    invoice.project_id,
    invoice.client_id,
    invoiceId,
    invoice.amount
  );

  // 3. Update the Invoice Request status to 'Approved'
  await repo.UpdateInvoiceStatus(invoiceId, 'Approved');

  return { success: true, message: "Invoice approved and recorded as revenue." };
};
