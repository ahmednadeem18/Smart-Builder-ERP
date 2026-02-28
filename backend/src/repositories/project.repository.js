import db from '../../config/db.js'
import { ExecuteQuery } from '../../utils/queryhandler.js';


/*
 this query will be used at Admin Dashboard, there will
 be buttom to see all projects
*/
export const GetAllProjects = async () => {
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
  return ExecuteQuery(query);
}


/*
 this query will be used at Admin Dashboard, it will be 
 showing the ongoing projects
*/
export const GetAllOngoingProjects = async () => {
 
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
  return ExecuteQuery(query);   
}

/*
  this query will provide tow things, 

      one is the actual budget of the specific project
      other is the planned budget of the specific project
      (total bugget consumed till now and remaining will be substraction of both quantities)
    
    
    this query will be used in the admin dashboard at the budget overview option 
    while view ongoing budgets or all bidgets
*/
export const GetProjectBudgetOverview = async (id) => {
  const query = `
       SELECT
        p.id,
        p.project_name,
        (
          pb.labour_cost +
          pb.material_cost +
          pb.equipment_rent +
          pb.subcontractor_cost
        ) AS planned_budget,
        IFNULL(SUM(e.amount), 0) AS actual_expense
      FROM Project p
      JOIN Project_Budget pb ON p.budget_id = pb.id
      LEFT JOIN Expense e ON p.id = e.project_id
      WHERE p.id = ?
      GROUP BY 
        p.id,
        p.project_name,
        pb.labour_cost,
        pb.material_cost,
        pb.equipment_rent,
        pb.subcontractor_cost`;
  return ExecuteQuery(query, id);
}
/*
  this query will provide tow things, 

      one is the total of actual budget of all projects
      other is the total of planned budget of all projects
      (total bugget consumed till now and remaining will be substraction of both quantities)
    
    
    this query will be used in the admin dashboard at 
    the budget overview option while view ongoing 
    budgets or all bidgets
*/
export const GetOverviewOfAllProjects = async () => {

  const query = `
    SELECT
        COUNT(DISTINCT p.id) AS total_projects,

        SUM(
          pb.labour_cost +
          pb.material_cost +
          pb.equipment_rent +
          pb.subcontractor_cost
        ) AS total_planned_budget,
        IFNULL(SUM(e.amount), 0) AS total_actual_expense
      FROM Project p
      JOIN Project_Budget pb ON p.budget_id = pb.id
      LEFT JOIN Expense e ON p.id = e.project_id

  `;
  return ExecuteQuery(query);
}
