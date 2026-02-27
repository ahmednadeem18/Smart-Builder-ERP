import db from '../../config/db.js';
import { HandleQuery } from '../../utils/queryhandler.js';

/*
 this query will be used at Admin Dashboard, there will
 be buttom to see all projects
*/
export const GetAllProjects = async (req, res) => {
  const query = `
      SELECT 
            p.id,
            p.project_name,
            p.start_date,
            p.end_date,
            p.status,
            c.name AS client_name,
            d.username AS director_name,
            m.username AS manager_name
          FROM Project p
          JOIN Client c ON p.client_id = c.id
          JOIN User d ON p.director_id = d.id
          JOIN User m ON p.manager_id = m.id `;
  return HandleQuery(res, query);
}


/*
 this query will be used at Admin Dashboard, it will be 
 showing the ongoing projects
*/
export const GetAllOngoingProjects = async (req, res) => {
 
    const query = `
        SELECT 
              p.id,
              p.project_name,
              p.start_date,
              p.end_date,
              p.status,
              c.name AS client_name,
              d.username AS director_name,
              m.username AS manager_name
            FROM Project p
            JOIN Client c ON p.client_id = c.id
            JOIN User d ON p.director_id = d.id
            JOIN User m ON p.manager_id = m.id
            WHERE p.status = 'Ongoing'; `;
  return HandleQuery(res, query);
   
}