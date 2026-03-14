import * as subService from '../services/subcontractor.services.js';

/**
 * PM dashboard se category aur project select karke request bhejta hai
 */
// subcontractor.controller.js
export const CreateSubRequest = async (req, res, next) => {
    try {
        const { projectId, categoryId } = req.body;
        const userId = req.user.id; // Token se PM ki ID khud aa jayegi

        // Validation: Check karein ke data empty to nahi
        if (!projectId || !categoryId) {
            return res.status(400).json({ success: false, message: "Project and Category are required" });
        }

        await subService.CreateSubRequest(projectId, categoryId, userId);

        res.status(201).json({
            success: true,
            message: "Request successfully sent to Subcontractor Manager."
        });
    } catch (error) { next(error); }
};

/**
 * SM dashboard par 'Pending' requests ki list dekhta hai
 */
export const GetPendingRequests = async (req, res, next) => {
    try {
        const data = await subService.GetPendingRequests();
        res.status(200).json({
            success: true,
            message: "Pending requests retrieved",
            data: data
        });
    } catch (error) { next(error); }
};

/**
 * SM dropdown fill karne ke liye category wise subcontractors mangwata hai
 */
export const GetSubcontractors = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const data = await subService.GetSubcontractors(categoryId);
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) { next(error); }
};

/**
 * SM jab subcontractor select karke price fix karta hai
 */
export const ApproveSubcontractorAllocation = async (req, res, next) => {
    try {
        const { requestId, subcontractorId, projectId, price } = req.body;
        const userId = req.user.id; // SM ki ID jo approve kar raha hai

        const result = await subService.ApproveSubcontractorAllocation({
            requestId,
            subcontractorId,
            projectId,
            price,
            userId
        });

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) { next(error); }
};