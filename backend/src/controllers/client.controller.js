import { HandleQuery } from '../../utils/queryhandler.js';


/* 
  this query will be used in the admin dasboard 
  for listing down all the clients aling with their
  account details
*/
export const GetAllClients = (req, res) => {
  const query = `
    SELECT
    c.id,
    c.name,
    c.phone_number,
    ad.bank_name,
    ad.holder_name
    FROM Client c
    LEFT JOIN Account_Details ad
    ON c.account_id = ad.id`;
  
  return HandleQuery(res, query);
}



/* 
  this query will be used in the admin dasboard 
  for listing the specfic cleint along with their
  account details
*/
export const GetSpecificClient = (req, res) => {

  const { id } = req.params;
  const query = `
      SELECT
      c.id,
      c.name,
      c.phone_number,
      ad.IBAN,
      ad.bank_name,
      ad.holder_name
      FROM Client c
      LEFT JOIN Account_Details ad
      ON c.account_id=ad.id
      WHERE c.id=?
  `
  return HandleQuery(res, query, [id]);
}

/* 
  this query will be used in the client profile 
  for listing down all their projects
*/
export const GetProjectsOfSpecificClient = (req, res) => {

  const { id } = req.params;
  const query = `
      SELECT
      id,
      project_name,
      status,
      start_date,
      end_date
      FROM Project
      WHERE client_id=?
  `
  return HandleQuery(res, query, [id]);
}


/* 
  this query will be used in the client profile 
  will display the finance of them
*/
export const GetPaymentsOfSpecificClient = (req, res) => {

  const { id } = req.params;
  const query = `
      SELECT
      p.project_name,
      SUM(r.amount) AS total_paid
      FROM Revenue r
      JOIN Project p ON r.project_id=p.id
      WHERE r.client_id=?
      GROUP BY p.id
  `
  return HandleQuery(res, query, [id]);
}

/* 
  this query will be used in the client profile 
  will display the invoices of them
*/
export const GetInvoiceOfSpecificClient = (req, res) => {

  const { id } = req.params;
  const query = `
      SELECT
      p.project_name,
      ir.amount,
      ir.status,
      ir.req_date
      FROM Invoice_Request ir
      JOIN Project p ON ir.project_id=p.id
      WHERE ir.client_id=?;
  `
  return HandleQuery(res, query, [id]);
}

