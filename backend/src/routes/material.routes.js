import express from 'express';
import * as controller from '../controllers/material.controller.js';

const router = express.Router();

router.get('/stock', controller.GetCurrentAmountOfMaterial);
router.get('/shipments', controller.GetAllShipments);
router.get('/project/:projectId', controller.GetSpecificShipment);
router.get('/allocated', controller.GetTotalAllocatedMaterial);

export default router;