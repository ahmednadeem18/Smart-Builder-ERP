import { HandleQuery } from "../../utils/queryhandler";

/* 
  this query will be used the show the 
  total stock currenlty admin is having
  this query will be used in admin dashboard
*/

export const GetCurrentAmountOfMaterial = (res, req) => {
  const query = `
    SELECT
    mc.id,
    mc.name,
    mc.unit,
    IFNULL(SUM(mi.quantity),0) AS total_stock
    FROM Material_Category mc
    LEFT JOIN Material_Inventory mi
    ON mc.id = mi.category_id
    GROUP BY mc.id;`;
  return HandleQuery(res, query);
}

/* 
  
*/

export const GetAllShipments = (res, req) => {
  const query = `
    SELECT
    ms.id,
    mc.name AS material,
    mc.unit,
    s.name AS supplier,
    ms.quantity,
    ms.price,
    ms.payment_status
    FROM Material_Shipment ms
    JOIN Supplier s
    ON ms.supplier_id = s.id
    JOIN Material_Category mc
    ON ms.category_id = mc.id
    ORDER BY ms.id DESC;`;
  return HandleQuery(res, query);
}

/*
  this query will be used at 
      admin dasboaard while viewing the projects
      project managers dashboard
*/
export const GetSpecificShipment = (res, req) => {
  const { id } = req.params;
  const query = `
    SELECT 
    p.project_name,
    mc.name AS material,
    mc.unit,
    ma.quantity
    FROM Material_Allocation ma
    JOIN Project p
    ON ma.project_id = p.id
    JOIN Material_Category mc
    ON ma.category_id = mc.id
    WHERE p.id = ?;`;
  return HandleQuery(res, query, [id]);  
}