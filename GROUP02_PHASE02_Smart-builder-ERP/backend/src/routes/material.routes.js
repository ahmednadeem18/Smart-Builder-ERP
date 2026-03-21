import express from 'express';
import * as controller from '../controllers/material.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
// material.routes.js
router.post('/request', verifyToken, controller.CreateMaterialRequest);
// --- VIEW ROUTES (GET) ---
router.get('/stock', verifyToken, controller.GetCurrentAmountOfMaterial);
router.get('/shipments', verifyToken, controller.GetAllShipments);
router.get('/suppliers', verifyToken, controller.GetSuppliers);
router.get('/requests/pending', verifyToken, controller.GetPendingRequests);

/** * NEW ROUTE: Manager jab request pe click karega 
 * to ye route usay batches dikhaye ga.
 * Example: /api/material/inventory-batches?categoryId=1&requestedQty=500
 */
router.get('/inventory-batches', verifyToken, controller.GetInventoryBatches);


// --- ACTION ROUTES (POST) ---

/** @route POST /api/material/shipment/manual */
router.post('/shipment/manual', verifyToken, controller.CreateManualShipment);

/** @route POST /api/material/approve-batch */
// Is route par manager specific inventory ID ke sath approve karega
router.post('/approve-batch', verifyToken, controller.ApproveFromSpecificBatch);

export default router;