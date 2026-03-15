import * as repo from '../repositories/hr.repository.js';
import { CreatePaymentRequest } from '../repositories/material.repository.js'; // Finance function reuse kar rahe hain

// --- 1. PM Action: HR Request ---
export const CreateHRRequest = async (data) => {
  const { projectId, categoryId, categoryType, quantity, userId } = data;
  
  if (!projectId || !categoryId || !categoryType || !quantity) {
    throw new Error("Bhai, saari fields lazmi hain (Project, Category, Type, Quantity)!");
  }

  const result = await repo.CreateHRAllocationRequest(projectId, categoryId, categoryType, quantity, userId);
  return { success: true, message: "HR Request dashboard par bhej di gayi hai.", requestId: result.insertId };
};

// --- 2. HR Manager Action: Approval & Auto-Allocation ---
export const ApproveHRRequest = async (data) => {
  const { requestId, projectId, categoryId, categoryType, quantity, days, userId } = data;

  let selectedWorkers = [];
  let totalDailyWage = 0;
  const tableName = categoryType === 'Skilled' ? 'Skilled_Labour' : 'Unskilled_Labour';

  // 1. Available workers dhoondna (Option 2: Auto-Selection)
  if (categoryType === 'Engineer') {
    selectedWorkers = await repo.GetEngineersByCategory(categoryId);
  } else {
    selectedWorkers = await repo.GetFirstAvailableWorkers(tableName, categoryId, quantity);
  }

  // Check agar quantity poori nahi hai
  if (categoryType !== 'Engineer' && selectedWorkers.length < quantity) {
    throw new Error(`Maazrat! Sirf ${selectedWorkers.length} bande free hain. Request poori nahi ho sakti.`);
  }

  // 2. Dates aur Cost Calculate karna
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + parseInt(days));

  // Har bande ki dhiari jama karna
  selectedWorkers.forEach(worker => {
    totalDailyWage += parseFloat(worker.daily_wage);
  });
  
  const totalAmount = totalDailyWage * days;

  // 3. Allocation Record banana
  const allocation = await repo.CreateHRAllocationEntry(projectId, requestId, startDate, endDate, totalAmount);
  const allocationId = allocation.insertId;

  // 4. Workers ko Lock karna (allocation_id update)
  if (categoryType !== 'Engineer') {
    const workerIds = selectedWorkers.map(w => w.hr_id);
    await repo.UpdateWorkersAllocationID(tableName, workerIds, allocationId);
  }

  // 5. FINANCE: Bilal ko payment request bhejna
  const hrExpId = await repo.GetHRExpenseCategoryId();
  // Note: HR Manager ki userId pass ho rahi hai as Requester
  await CreatePaymentRequest(projectId, hrExpId, null, userId, totalAmount);

  // 6. Request Status Update
  await repo.UpdateHRRequestStatus(requestId, 'Allocated');

  return { 
    success: true, 
    message: `${selectedWorkers.length} workers allocate ho gaye hain ${days} dino ke liye. Total Cost: ${totalAmount}` 
  };
};

// --- 3. HR Manager Action: Free Labour ---
export const FreeLabourAllocation = async (allocationId, categoryType) => {
  if (!allocationId || !categoryType) throw new Error("Allocation ID aur Type zaroori hai.");
  
  await repo.ReleaseLabourPool(allocationId, categoryType);
  return { success: true, message: "Labour ko free kar diya gaya hai aur status update ho gaya hai." };
};

// --- 4. View Helpers ---
export const GetPendingRequests = async () => {
  return await repo.GetPendingHRRequests();
};

export const GetAllAllocations = async () => {
  return await repo.GetAllActiveAllocations();
};

export const GetAllHumanResources = async () => {
  return await repo.GetAllHumanResources();
}