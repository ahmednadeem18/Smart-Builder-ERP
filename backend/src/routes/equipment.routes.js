import express from 'express';
import * as controller from '../controllers/equipment.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();

// --- VIEW ROUTES (GET) ---
router.use(verifyToken);
/** @route GET /api/equipment/all */
router.get('/all', controller.GetAllEquipments);

/** @route GET /api/equipment/rented */
router.get('/rented', controller.GetAllRentedEquipments);

/** @route GET /api/equipment/owned */
router.get('/owned', controller.GetOwnedEquipments);

/** @route GET /api/equipment/requests/pending */

router.post('/request', controller.CreateRequest);
router.get('/pending', controller.GetPending);
router.get('/active', controller.GetActive);
router.post('/approve', controller.Approve);
router.post('/release', controller.Release);
export default router;