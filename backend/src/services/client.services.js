import * as repo
  from '../repositories/client.repositroy.js'

export const GetAllClients = async () => {
  return await repo.GetAllClients();
}

export const GetSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    throw new Error("Invalid client ID");
  }
  return await repo.GetSpecificClient(id);
}

export const GetProjectsOfSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    throw new Error("Invalid client ID");
  }
  return await repo.GetProjectsOfSpecificClient(id);
}

export const GetPaymentsOfSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    throw new Error("Invalid client ID");
  }
  return await repo.GetPaymentsOfSpecificClient(id);
}

export const GetInvoiceOfSpecificClient = async (id) => {

  if (!id || isNaN(id)) {
    throw new Error("Invalid client ID");
  }
  return await repo.GetInvoiceOfSpecificClient(id);
}

export const CreateClient = async (body) => {

  const { name, phone_number, account_id } = body;

  if (!name) {
    throw new Error("Client name is required");
  }

  if (!phone_number) {
    throw new Error("Phone number is required");
  }
  if (!account_id || isNaN(account_id)) {
    throw new Error("Valid account ID is required");
  }
  if (account_id < 0) {
    throw new Error("Account ID cannot be negative");
  }
  if(account_id >= 1000000) {
    throw new Error("Account ID is too large");
  }

  return await repo.CreateClient(name, phone_number, account_id);
};


export const GetClientFullProfile = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid client ID");
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