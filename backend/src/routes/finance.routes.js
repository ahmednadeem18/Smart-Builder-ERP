import express from 'express';
import * as controller from '../controllers/finance.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(allowRoles("Finance Officer", "Director"));

/** @route GET /api/finance/expenses */
router.get('/expenses', controller.GetAllExpenses);

/** @route GET /api/finance/revenues */
router.get('/revenues', controller.GetAllRevenues);

/** @route GET /api/finance/payments/pending */
router.get('/payments/pending', controller.GetPendingPayments);

/** @route GET /api/finance/invoices/pending */
router.get('/invoices/pending', controller.GetPendingInvoices);


/** * @route POST /api/finance/payment/approve/:id 
 * Description: Approves a payment request and logs it as an expense.
 */
router.post('/payment/approve/:id', controller.ApprovePaymentRequest);

/** * @route POST /api/finance/invoice/approve/:id 
 * Description: Approves a client invoice and logs it as revenue.
 */
router.post('/invoice/approve/:id', controller.ApproveInvoiceRequest);

/** * @route POST /api/finance/decline 
 * Body: { id, type }
 */
// router.post('/decline', controller.DeclineRequest);

export default router;
