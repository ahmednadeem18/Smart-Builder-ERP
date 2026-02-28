import db from '../../config/db.js'


/*
  this query will show all human resources with their
  category type,  availabilty
  this will used in the admin dashboard
*/

export const GetAllHumanResources = async () => {
  const query = `
  SELECT
  hr.id,
  hr.name,
  hr.gender,
  hr.status AS employment_status,
  hc.name AS category,

  CASE
      WHEN e.hr_id IS NOT NULL THEN 'Engineer'
      WHEN sl.hr_id IS NOT NULL THEN 'Skilled Labour'
      WHEN ul.hr_id IS NOT NULL THEN 'Unskilled Labour'
  END AS worker_type

  FROM Human_Resource hr
  LEFT JOIN Engineer e ON hr.id = e.hr_id
  LEFT JOIN Skilled_Labour sl ON hr.id = sl.hr_id
  LEFT JOIN Unskilled_Labour ul ON hr.id = ul.hr_id
  LEFT JOIN HR_Category hc
  ON hc.id = COALESCE(
      e.category_id,
      sl.category_id,
      ul.category_id
  )`;
  const [rows] = await db.query(query);
  return rows;
}