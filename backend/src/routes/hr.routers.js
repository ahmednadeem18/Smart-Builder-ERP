import express from 'express';
import * as controller from '../controllers/hr.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Sab routes ke liye token zaroori hai
router.use(verifyToken);

router.get('/resources', controller.GetAllHumanResources);
router.get('/requests/pending', controller.GetPendingRequests);
router.post('/request', controller.CreateHRRequest);
router.post('/approve', controller.ApproveHRRequest);
router.post('/free', controller.FreeLabourAllocation);

export default router;