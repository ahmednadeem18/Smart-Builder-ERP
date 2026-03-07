import * as service 
  from '../services/material.services.js'

export const GetCurrentAmountOfMaterial = async (req, res, next) => {
  try {
    const projects = await service.GetCurrentAmountOfMaterial();  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetAllShipments = async (req, res, next) => {
  try {
    const projects = await service.GetAllShipments();  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetSpecificShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = await service.GetSpecificShipment(id);  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}


export const GetAllocationsByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = await service.GetAllocationsByCategory(id);  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetTotalAllocatedMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projects = await service.GetTotalAllocatedMaterial(id);  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}
