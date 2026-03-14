import * as subRepo from '../repositories/subcontractor.repository.js';
import { CreatePaymentRequest } from '../repositories/material.repository.js'; // Aapka common finance function

// PM ki request handle karna
export const CreateSubRequest = async (projectId, categoryId, userId) => {
    return await subRepo.CreateSubAllocationRequest(projectId, categoryId, userId);
};

// SM ke liye pending list lana
export const GetPendingRequests = async () => {
    return await subRepo.GetPendingSubRequests();
};

// Dropdown ke liye subcontractors lana
export const GetSubcontractors = async (categoryId) => {
    return await subRepo.GetSubcontractorsByCategory(categoryId);
};

// SM ka Approval aur Finance Request ka logic
export const ApproveSubcontractorAllocation = async (data) => {
    const { requestId, subcontractorId, projectId, price, userId } = data;

    // 1. Allocation Record create karein
    const allocation = await subRepo.CreateSubAllocation(subcontractorId, projectId, requestId, price);

    // 2. Subcontractor ki Account details nikalain
    const sub = await subRepo.GetSubcontractorAccount(subcontractorId);
    if (!sub || !sub.account_id) {
        throw new Error("Subcontractor account details missing.");
    }

    // 3. 'subcontractor' expense category ID nikalain
    const subExpenseId = await subRepo.GetSubcontractorExpenseCategoryId();

    // 4. Finance Module mein Payment Request bhejein
    // Note: status automatically 'Requested' hoga default value se
    await CreatePaymentRequest(
        projectId,
        subExpenseId,
        sub.account_id,
        userId,
        price
    );

    // 5. Original Request ka status update karein
    await subRepo.UpdateSubRequestStatus(requestId, 'Approved');

    return { 
        success: true, 
        message: "Subcontractor assigned and payment request sent to finance." 
    };
};