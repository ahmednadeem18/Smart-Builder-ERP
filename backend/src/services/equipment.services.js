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

/**
 * Main Logic for Approving Equipment Requests
 * Handles both Company-Owned and Rented workflows
 */
export const ApproveEquipmentRequest = async (requestId, equipmentId, projectId, startDate, endDate) => {
  // 1. Get equipment details to check ownership
  const allEquipments = await repo.GetAllEquipments();
  const selectedEquipment = allEquipments.find(e => e.id === equipmentId);

  if (!selectedEquipment || selectedEquipment.status !== 'Available') {
    throw new Error('Equipment is not available for allocation.');
  }

  // 2. Create the Allocation (This triggers the DB status change to 'In-use')
  const allocation = await repo.CreateEquipmentAllocation(equipmentId, projectId, requestId, startDate);

  // 3. Handle Financials if the equipment is Rented
  if (selectedEquipment.ownership_type === 'Rented') {
    const [rentalInfo] = await repo.GetRentalRateAndAccount(equipmentId);
    
    if (rentalInfo) {
      // Calculate duration in days (including start and end date)
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const totalCost = diffDays * rentalInfo.daily_rate;
      const categoryId = await repo.GetEquipmentCategoryId();

      // Send the bill to the Finance Manager
      await repo.CreatePaymentRequest(projectId, categoryId, rentalInfo.account_id, totalCost);
    }
  }

  // 4. Update the Request status to 'Approved'
  await repo.UpdateRequestStatus(requestId, 'Approved');

  return { 
    message: `Request ${requestId} approved. ${selectedEquipment.ownership_type} equipment allocated.`,
    allocationId: allocation.insertId 
  };
};

/**
 * Fetch pending requests for the Manager Dashboard
 */
export const GetPendingRequests = async () => {
  return await repo.GetPendingEquipmentRequests();
};