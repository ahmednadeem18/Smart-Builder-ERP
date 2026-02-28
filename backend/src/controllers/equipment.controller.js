import * as service 
  from '../services/equipment.services'

export const GetAllEquipments = async (req, res, next) => {
  try {
    const projects = await service.GetAllEquipments();  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetAllRentedEquipments = async (req, res, next) => {
  try {
    const projects = await service.GetAllRentedEquipments();  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const GetOwnedEquipments = async (req, res, next) => {
  try {
    const projects = await service.GetOwnedEquipments();  
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}
