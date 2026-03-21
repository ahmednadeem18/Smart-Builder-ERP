import * as service from '../services/finance.services.js';

export const GetAllExpenses = async (req, res, next) => {
  try {
    const data = await service.GetAllExpenses();
    res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully",
      data: data
    });
  } catch (error) { next(error); }
};

export const GetAllRevenues = async (req, res, next) => {
  try {
    const data = await service.GetAllRevenues();
    res.status(200).json({
      success: true,
      message: "Revenues retrieved successfully",
      data: data
    });
  } catch (error) { next(error); }
};

export const GetPendingPayments = async (req, res, next) => {
  try {
    const data = await service.GetPendingPayments();
    res.status(200).json({
      success: true,
      message: "Pending payment requests retrieved successfully",
      data: data
    });
  } catch (error) { next(error); }
};

export const GetPendingInvoices = async (req, res, next) => {
  try {
    const data = await service.GetPendingInvoices();
    res.status(200).json({
      success: true,
      message: "Pending invoice requests retrieved successfully",
      data: data
    });
  } catch (error) { next(error); }
};


//Triggered when Finance Manager clicks "Approve" on a Payment Request

export const ApprovePaymentRequest = async (req, res, next) => {
  try {
    const { id } = req.params; // Extracting ID from URL
    const result = await service.ApprovePaymentRequest(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) { next(error); }
};


// Triggered when Finance Manager clicks "Approve" on a Client Invoice

export const ApproveInvoiceRequest = async (req, res, next) => {
  try {
    const { id } = req.params; // Extracting ID from URL
    const result = await service.ApproveInvoiceRequest(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) { next(error); }
};
