import express from 'express';
import * as controller from '../controllers/equipment.controller.js';

const router = express.Router();

// --- VIEW ROUTES (GET) ---

/** @route GET /api/equipment/all */
router.get('/all', controller.GetAllEquipments);

/** @route GET /api/equipment/rented */
router.get('/rented', controller.GetAllRentedEquipments);

/** @route GET /api/equipment/owned */
router.get('/owned', controller.GetOwnedEquipments);

/** @route GET /api/equipment/requests/pending */
router.get('/requests/pending', controller.GetPendingRequests);


// --- ACTION ROUTES (POST/PUT) ---

/** * @route POST /api/equipment/approve
 * Body: { requestId, equipmentId, projectId, startDate, endDate }
 */
router.post('/approve', controller.ApproveRequest);

export default router;