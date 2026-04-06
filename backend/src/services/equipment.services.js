import * as repo from '../repositories/equipment.repository.js';

export const GetAllEquipments = async () => {
  return await repo.GetAllEquipments();
};

export const GetAllRentedEquipments = async () => {
  return await repo.GetAllRentedEquipments();
};

export const GetOwnedEquipments = async () => {
  return await repo.GetOwnedEquipments();
};


export const SendRequest = async (data) => {
    return await repo.CreateAllocationRequest(data.projectId, data.userId, data.categoryId);
};

/**
 * Fetch pending requests for the Manager Dashboard
 */
export const GetPendingRequests = async () => {
  return await repo.GetPendingEquipmentRequests();
};


export const ApproveEquipmentRequest = async (data) => {
    const { requestId, projectId, categoryId, days, userId } = data;

    // 1. Available Machine Check
    const equipment = await repo.FindAvailableEquipment(categoryId);
    if (!equipment) throw new Error("Bhai, is category ki koi machine is waqt free nahi hai!");

    // 2. Dates setup
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parseInt(days));

    // 3. Rental Payment Logic (If Rented)
    if (equipment.ownership_type === 'Rented') {
        const rental = await repo.GetRentalRate(equipment.id);
        
        if (rental && rental.total_days > 0) {
            // Rent Calculation: (Total / Contract Days) * Allocated Days
            const perDayRate = rental.total_rent / rental.total_days;
            const finalAmount = perDayRate * days;
            
            const expenseId = await repo.GetEquipExpenseId();
            
            // Payment Request create karna
            await repo.CreateEquipmentPaymentRequest(
                projectId, 
                expenseId, 
                rental.renter_id, 
                userId, 
                finalAmount
            );
        }
    }

    // 4. Finalize Database State
    await repo.SaveAllocation(equipment.id, projectId, requestId, startDate, endDate);
    await repo.UpdateRequestStatus(requestId, 'Approved');

    return { success: true, message: `${equipment.name} allocate ho gaya hai.` };
};

export const ReleaseEquipmentToPool = async (equipmentId) => {
    await repo.UpdateEquipmentStatus(equipmentId, 'Available');
    return { success: true, message: "Equipment ab pool mein wapas aa gaya hai." };
};

export const FetchPendingRequests = async () => {
    return await repo.GetPendingEquipmentRequests();
};

export const FetchActiveAllocations = async () => {
    return await repo.GetActiveAllocations();
};