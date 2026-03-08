import express from 'express';
import * as controller from '../controllers/material.controller.js';

const router = express.Router();

// --- VIEW ROUTES (GET) ---

/** @route GET /api/material/stock */
router.get('/stock', controller.GetCurrentAmountOfMaterial);

/** @route GET /api/material/shipments */
router.get('/shipments', controller.GetAllShipments);

/** @route GET /api/material/project/:id */
router.get('/project/:id', controller.GetSpecificShipment);

/** @route GET /api/material/allocated */
router.get('/allocated', controller.GetTotalAllocatedMaterial);

/** @route GET /api/material/suppliers */
router.get('/suppliers', controller.GetSuppliers);

/** @route GET /api/material/requests/pending */
router.get('/requests/pending', controller.GetPendingRequests);


// --- ACTION ROUTES (POST) ---

/** * @route POST /api/material/shipment/manual 
 * Body: { categoryId, supplierId, quantity, pricePerUnit }
 */
router.post('/shipment/manual', controller.CreateManualShipment);

/** * @route POST /api/material/approve 
 * Body: { requestId, categoryId, projectId, requestedQty, supplierId, pricePerUnit }
 */
router.post('/approve', controller.ApproveRequest);

export default router;