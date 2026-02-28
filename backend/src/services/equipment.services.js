import * as repo
  from '../repositories/equipment.repository.js'

export const GetAllEquipments = async () => {
  return await repo.GetAllEquipments();
}

export const GetAllRentedEquipments = async () => {
  return await repo.GetAllRentedEquipments();
}

export const GetOwnedEquipments = async () => {
  return await repo.GetOwnedEquipments();
}
