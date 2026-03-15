import * as service from '../services/material.services.js';

// --- VIEW CONTROLLERS ---

export const GetCurrentAmountOfMaterial = async (req, res, next) => {
  try {
    const data = await service.GetCurrentAmountOfMaterial();  
    res.status(200).json({ success: true, message: "Current stock retrieved", data });
  } catch (error) { next(error); }
}
export const CreateMaterialRequest = async (req, res, next) => {
  try {
    const { projectId, categoryId, quantity } = req.body;
    const userId = req.user.id;

    // Poora object aik sath bhejein {} brackets ke sath
    const result = await service.CreateMaterialRequest({
      projectId,
      categoryId,
      quantity,
      userId
    });

    res.status(201).json(result);
  } catch (error) { next(error); }
};
export const GetPendingRequests = async (req, res, next) => {
  try {
    const data = await service.GetPendingRequests();
    res.status(200).json({ success: true, message: "Pending requests retrieved", data });
  } catch (error) { next(error); }
};

/**
 * NEW: Manager jab request par click karega, to usay specific batches/rows dikhane ke liye
 * Query Params: categoryId, requestedQty
 */
export const GetInventoryBatches = async (req, res, next) => {
  try {
    const { categoryId, requestedQty } = req.query;
    const data = await service.GetInventoryBatches(categoryId, requestedQty);
    res.status(200).json({ success: true, message: "Available batches retrieved", data });
  } catch (error) { next(error); }
};

export const GetSuppliers = async (req, res, next) => {
  try {
    const data = await service.GetSuppliers();
    res.status(200).json({ success: true, message: "Suppliers retrieved", data });
  } catch (error) { next(error); }
};

// --- ACTION CONTROLLERS ---

/**
 * MANUAL SHIPMENT: Manager jab khud naya maal mangwaye ga
 */
export const CreateManualShipment = async (req, res, next) => {
  try {
    // Service ab seedha object le rahi hai
    const result = await service.CreateManualShipment(req.body);
    
    res.status(201).json({
      success: true,
      message: "Manual shipment logged. Inventory updated.",
      data: result
    });
  } catch (error) { next(error); }
};

/**
 * BATCH APPROVAL: Specific inventory row se allocate karna aur Finance entry dalna
 */
export const ApproveFromSpecificBatch = async (req, res, next) => {
  try {
    // Body data ke saath token se user ID (Material Manager) merge karna
    const approvalData = {
        ...req.body,
        userId: req.user.id 
    };

    const result = await service.ApproveFromSpecificBatch(approvalData);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) { next(error); }
};

// --- ADDITIONAL VIEWS ---

export const GetAllShipments = async (req, res, next) => {
  try {
    const data = await service.GetAllShipments();  
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
}

export const GetTotalAllocatedMaterial = async (req, res, next) => {
  try {
    const data = await service.GetTotalAllocatedMaterial();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};