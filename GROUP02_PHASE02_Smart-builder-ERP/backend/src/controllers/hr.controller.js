import * as service from '../services/hr.services.js';

// --- 1. Dashboard View: Tamam Resources ---
export const GetAllHumanResources = async (req, res, next) => {
  try {
    const resources = await service.GetAllHumanResources();  
    res.status(200).json({
      success: true,
      message: "Human resources retrieved successfully",
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// --- 2. PM Action: HR Request Create Karna ---
export const CreateHRRequest = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.user.id // Token se PM ki ID mil rahi hai
    };
    const result = await service.CreateHRRequest(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// --- 3. HR Manager Action: Request Approve Karna ---
export const ApproveHRRequest = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.user.id // Token se HR Manager ki ID mil rahi hai
    };
    const result = await service.ApproveHRRequest(data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// --- 4. HR Manager Action: Labour ko Free Karna ---
export const FreeLabourAllocation = async (req, res, next) => {
  try {
    const { allocationId, categoryType } = req.body;
    const result = await service.FreeLabourAllocation(allocationId, categoryType);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// --- 5. Helper: Pending Requests ki List ---
export const GetPendingRequests = async (req, res, next) => {
  try {
    const data = await service.GetPendingRequests();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};