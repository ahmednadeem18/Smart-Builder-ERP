import express from 'express';
import * as c from '../controllers/client.controller.js';

const router = express.Router();

router.get('/', c.GetAllClients);
router.get('/:id', c.GetSpecificClient);
router.get('/:id/projects', c.GetProjectsOfSpecificClient); 
router.get('/:id/payments', c.GetPaymentsOfSpecificClient);
router.get('/:id/invoices', c.GetInvoiceOfSpecificClient);

export default router;