import * as repo
  from '../repositories/client.repositroy.js'

export const GetAllClients = async () => {
  return await repo.GetAllClients();
}

export const GetSpecificClient = async (id) => {
  return await repo.GetSpecificClient(id);
}

export const GetProjectsOfSpecificClient = async (id) => {
  return await repo.GetProjectsOfSpecificClient();
}

export const GetPaymentsOfSpecificClient = async (id) => {
  return await repo.GetPaymentsOfSpecificClient();
}

export const GetInvoiceOfSpecificClient = async (id) => {
  return await repo.GetInvoiceOfSpecificClient();
}