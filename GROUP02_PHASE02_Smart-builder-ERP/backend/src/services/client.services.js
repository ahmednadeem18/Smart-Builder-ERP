import * as repo
  from '../repositories/client.repositroy.js'

export const GetAllClients = async () => {
  return await repo.GetAllClients();
}

export const GetSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    const error = new Error("Invalid client ID");
    error.status = 400;
    throw error;
  }
  return await repo.GetSpecificClient(id);
}

export const GetProjectsOfSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    const error = new Error("Invalid client ID");
    error.status = 400;
    throw error;
  }
  return await repo.GetProjectsOfSpecificClient(id);
}

export const GetPaymentsOfSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    const error = new Error("Invalid client ID");
    error.status = 400;
    throw error;
  }
  return await repo.GetPaymentsOfSpecificClient(id);
}

export const GetInvoiceOfSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    const error = new Error("Invalid client ID");
    error.status = 400;
    throw error;
  }
  return await repo.GetInvoiceOfSpecificClient(id);
}

export const CreateClient = async (body) => {

  const { name, phone_number, account_id } = body;

  if (!name) {
    const error = new Error("Client name is required");
    error.status = 400;
    throw error;
  }

  if (!phone_number) {
    const error = new Error("Phone number is required");
    error.status = 400;
    throw error;
  }
  if (!account_id || isNaN(account_id)) {
    const error = new Error("Valid account ID is required");
    error.status = 400;
    throw error;
  }
  if (account_id < 0) {
    const error = new Error("Account ID cannot be negative");
    error.status = 400;
    throw error;
  }
  if(account_id >= 1000000) {
    const error = new Error("Account ID is too large");
    error.status = 400;
    throw error;
  }

  return await repo.CreateClient(name, phone_number, account_id);
};


export const GetClientFullProfile = async (id) => {
  if (!id || isNaN(id)) {
    const error = new Error("Invalid client ID");
    error.status = 400;
    throw error;
  }

  const clientInfo = await repo.GetSpecificClient(id);
  const projects = await repo.GetProjectsOfSpecificClient(id);
  const payments = await repo.GetPaymentsOfSpecificClient(id);
  const invoices = await repo.GetInvoiceOfSpecificClient(id);
  const profile = {
    client: clientInfo[0],
    projects,
    payments,
    invoices,
  };

  return profile;
};