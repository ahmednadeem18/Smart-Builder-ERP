import * as service from '../services/material.services.js';

// --- VIEW CONTROLLERS (Your existing code + helpers) ---

export const GetCurrentAmountOfMaterial = async (req, res, next) => {
  try {
    const projects = await service.GetCurrentAmountOfMaterial();  
    res.status(200).json({ success: true, data: projects });
  } catch (error) { next(error); }
}

export const GetAllShipments = async (req, res, next) => {
  try {
    const projects = await service.GetAllShipments();  
    res.status(200).json({ success: true, data: projects });
  } catch (error) { next(error); }
}

export const GetSpecificShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = await service.GetSpecificShipment(id);  
    res.status(200).json({ success: true, data: projects });
  } catch (error) { next(error); }
}

export const GetAllocationsByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = await service.GetAllocationsByCategory(id);  
    res.status(200).json({ success: true, data: projects });
  } catch (error) { next(error); }
}

export const GetTotalAllocatedMaterial = async (req, res, next) => {
  try {
    const projects = await service.GetTotalAllocatedMaterial();  
    res.status(200).json({ success: true, data: projects });
  } catch (error) { next(error); }
}

export const GetPendingRequests = async (req, res, next) => {
  try {
    const data = await service.GetPendingRequests();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const GetSuppliers = async (req, res, next) => {
  try {
    const data = await service.GetAllSuppliers();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

// --- ACTION CONTROLLERS (The Dashboard Buttons) ---

/**
 * MANUAL SHIPMENT: Triggered when Manager adds stock manually to inventory
 */
export const CreateManualShipment = async (req, res, next) => {
  try {
    const { categoryId, supplierId, quantity, pricePerUnit } = req.body;
    
    const result = await service.CreateManualShipment(
      categoryId, 
      supplierId, 
      quantity, 
      pricePerUnit
    );
    
    res.status(201).json({
      success: true,
      message: "Manual shipment logged. Inventory increased via trigger.",
      data: result
    });
  } catch (error) { next(error); }
};

/**
 * SMART APPROVAL: Triggered when Manager approves a PM's allocation request
 */
export const ApproveRequest = async (req, res, next) => {
  try {
    // req.body contains { requestId, categoryId, projectId, requestedQty, supplierId, pricePerUnit }
    const result = await service.ApproveMaterialRequest(req.body);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) { next(error); }
};