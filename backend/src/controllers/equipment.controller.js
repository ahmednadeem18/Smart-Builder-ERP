import * as service from '../services/equipment.services.js';

export const GetAllEquipments = async (req, res, next) => {
  try {
    const data = await service.GetAllEquipments();  
    res.status(200).json({
      success: true,
      message: "equipments retrieved successfully",
      data: data
    });
  } catch (error) {
    next(error);
  }
};

export const GetAllRentedEquipments = async (req, res, next) => {
  try {
    const data = await service.GetAllRentedEquipments();  
    res.status(200).json({
      success: true,
      message: "rented equipments retrieved successfully",
      data: data
    });
  } catch (error) {
    next(error);
  }
};

export const GetOwnedEquipments = async (req, res, next) => {
  try {
    const data = await service.GetOwnedEquipments();  
    res.status(200).json({
      success: true,
      message: "owned equipments retrieved successfully",
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * NEW: Get all requests waiting for manager approval
 */


/**
 * NEW: The main approval logic
 * Receives data from the React frontend to allocate equipment
 */
export const CreateRequest = async (req, res) => {
    try {
        const result = await service.SendRequest({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, message: "Request created" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// 1. Pending requests fetch karna
export const GetPending = async (req, res) => {
    try {
        const result = await service.FetchPendingRequests();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. In-use equipment ki list dekhna
export const GetActive = async (req, res) => {
    try {
        const result = await service.FetchActiveAllocations();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Request Approve aur Machine Allocate karna
export const Approve = async (req, res) => {
    try {
        const { requestId, projectId, categoryId, days } = req.body;
        const userId = req.user.id; // Token se user ID uthana (for payment requester)

        if (!requestId || !projectId || !categoryId || !days) {
            return res.status(400).json({ 
                success: false, 
                message: "Bhai, saari fields (Request, Project, Category, Days) lazmi hain!" 
            });
        }

        const result = await service.ApproveEquipmentRequest({
            requestId,
            projectId,
            categoryId,
            days,
            userId
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Equipment Approval Error:", error.message);
        res.status(error.status || 500).json({ 
            success: false, 
            message: error.message || "Allocation fail ho gayi hai." 
        });
    }
};

// 4. Equipment wapas pool mein bhejna (Release)
export const Release = async (req, res) => {
    try {
        const { equipmentId } = req.body;

        if (!equipmentId) {
            return res.status(400).json({ success: false, message: "Equipment ID zaroori hai." });
        }

        const result = await service.ReleaseEquipmentToPool(equipmentId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Release Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};