import * as service from '../services/equipment.services.js';

export const GetAllEquipments = async (req, res, next) => {
  try {
    const data = await service.GetAllEquipments();  
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    next(error);
  }
};

export const GetAllRentedEquipments = async (req, res, next) => {
  try {
    const data = await service.GetAllRentedEquipments();  
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    next(error);
  }
};

export const GetOwnedEquipments = async (req, res, next) => {
  try {
    const data = await service.GetOwnedEquipments();  
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    next(error);
  }
};

/**
 * NEW: Get all requests waiting for manager approval
 */
export const GetPendingRequests = async (req, res, next) => {
  try {
    const data = await service.GetPendingRequests();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    next(error);
  }
};

/**
 * NEW: The main approval logic
 * Receives data from the React frontend to allocate equipment
 */
export const ApproveRequest = async (req, res, next) => {
  try {
    const { requestId, equipmentId, projectId, startDate, endDate } = req.body; //

    // Validate that we have all required fields before calling the service
    if (!requestId || !equipmentId || !projectId || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: requestId, equipmentId, projectId, startDate, or endDate" 
      });
    }

    const result = await service.ApproveEquipmentRequest(
      requestId, 
      equipmentId, 
      projectId, 
      startDate, 
      endDate
    ); //

    res.status(200).json({
      success: true,
      message: result.message,
      data: result
    }); //
  } catch (error) {
    next(error); // Sends error to ErrorHandler.js
  }
};