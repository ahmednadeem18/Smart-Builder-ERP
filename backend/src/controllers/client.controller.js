import * as service 
  from '../services/client.services.js'

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
    const { id } = req.params;
    const clients = await service.GetSpecificClient(id);  
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
    const { id } = req.params;
    const clients = await service.GetProjectsOfSpecificClient(id);  
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
    const { id } = req.params;
    const clients = await service.GetPaymentsOfSpecificClient(id);  
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
    const { id } = req.params;
    const clients = await service.GetInvoiceOfSpecificClient(id);  
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
  }
}
