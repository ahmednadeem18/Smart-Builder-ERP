import express from 'express';
import * as controller from '../controllers/subcontractor.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// PM Routes: Request bhejney ke liye
router.post('/request', verifyToken, controller.CreateSubRequest);

// SM Routes: Dashboard aur Approval ke liye
router.get('/requests/pending', verifyToken, controller.GetPendingRequests);
router.get('/list/:categoryId', verifyToken, controller.GetSubcontractors);
router.post('/approve', verifyToken, controller.ApproveSubcontractorAllocation);

export default router;