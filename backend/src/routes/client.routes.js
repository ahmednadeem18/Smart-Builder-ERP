import express from 'express';
import * as c from '../controllers/client.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get('/', verifyToken, c.GetAllClients);
router.get('/:id', verifyToken, c.GetSpecificClient);
router.get('/:id/projects', verifyToken, c.GetProjectsOfSpecificClient); 
router.get('/:id/payments', verifyToken, c.GetPaymentsOfSpecificClient);
router.get('/:id/invoices', verifyToken, c.GetInvoiceOfSpecificClient);
router.post('/create', verifyToken, c.CreateClientWithAccount);
router.post('/', verifyToken, c.CreateClient);
export default router;