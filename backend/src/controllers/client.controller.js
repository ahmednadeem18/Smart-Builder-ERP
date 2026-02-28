import * as service 
  from '../services/client.services'

export const GetAllClients = async (req, res, next) => {
  try {
    const clients = await service.GetAllClients();  
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
  }
}

export const GetSpecificClient = async (req, res, next) => {
  try {
    const clients = await service.GetSpecificClient();  
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
  }
}

export const GetProjectsOfSpecificClient = async (req, res, next) => {
  try {
    const clients = await service.GetProjectsOfSpecificClient();  
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
  }
}

export const GetPaymentsOfSpecificClient = async (req, res, next) => {
  try {
    const clients = await service.GetPaymentsOfSpecificClient();  
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
  }
}

export const GetInvoiceOfSpecificClient = async (req, res, next) => {
  try {
    const clients = await service.GetInvoiceOfSpecificClient();  
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
  }
}
