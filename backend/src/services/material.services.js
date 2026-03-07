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

export const GetAllocationsByCategory = async () => {
  return await repo.GetAllocationsByCategory();
}

export const GetTotalAllocatedMaterial = async (id) => {
  return await repo.GetTotalAllocatedMaterial(id);
}

