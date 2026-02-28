import * as repo
  from '../repositories/client.repositroy.js'

export const GetAllClients = async () => {
  return await repo.GetAllClients();
}

export const GetSpecificClient = async () => {
  return await repo.GetSpecificClient();
}

export const GetProjectsOfSpecificClient = async () => {
  return await repo.GetProjectsOfSpecificClient();
}

export const GetPaymentsOfSpecificClient = async () => {
  return await repo.GetPaymentsOfSpecificClient();
}

export const GetInvoiceOfSpecificClient = async () => {
  return await repo.GetInvoiceOfSpecificClient();
}