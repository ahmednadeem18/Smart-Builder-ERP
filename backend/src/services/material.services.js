import * as repo
  from '../repositories/material.repository.js'

export const GetCurrentAmountOfMaterial = async () => {
  return await repo.GetCurrentAmountOfMaterial();
}

export const GetAllShipments = async () => {
  return await repo.GetAllShipments();
}

export const GetSpecificShipment = async (id) => {
  return await repo.GetSpecificShipment(id);
}
