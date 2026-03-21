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


/*
  Create new project
*/export const CreateProjectWithBudget = async (
  project_name,
  director_id,
  manager_id,
  client_id,
  start_date,
  labour_cost,
  material_cost,
  equipment_rent,
  subcontractor_cost
) => {

  const conn = await db.getConnection();

  try {

    await conn.beginTransaction();

    const budgetQuery = `
      INSERT INTO Project_Budget
      (labour_cost, material_cost, equipment_rent, subcontractor_cost)
      VALUES (?, ?, ?, ?)
    `;

    const [budgetResult] = await conn.query(budgetQuery, [
      labour_cost,
      material_cost,
      equipment_rent,
      subcontractor_cost
    ]);

    const budget_id = budgetResult.insertId;

    const projectQuery = `
      INSERT INTO Project
      (project_name, director_id, manager_id, budget_id, client_id, start_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Ongoing')
    `;

    await conn.query(projectQuery, [
      project_name,
      director_id,
      manager_id,
      budget_id,
      client_id,
      start_date
    ]);

    await conn.commit();

    return {
      success: true,
      budget_id
    };

  } catch (error) {

    await conn.rollback();

    throw error;

  } finally {

    conn.release();

  }

};

export const UpdateProjectStatus = async (project_id, status) => {

  const conn = await db.getConnection();

  try {

    await conn.beginTransaction();

    await conn.query(
      `UPDATE Project
       SET status = ?
       WHERE id = ?`,
      [status, project_id]
    );

    if (status === "Completed") {

      await conn.query(`
        UPDATE Skilled_Labour
        SET status = 'Free'
        WHERE hr_id IN (
          SELECT hr_id
          FROM HR_Allocation
          WHERE project_id = ?
        )
      `, [project_id]);

      await conn.query(`
        UPDATE Unskilled_Labour
        SET status = 'Free'
        WHERE hr_id IN (
          SELECT hr_id
          FROM HR_Allocation
          WHERE project_id = ?
        )
      `, [project_id]);

      await conn.query(`
        UPDATE HR_Allocation
        SET end_date = CURDATE()
        WHERE project_id = ?
        AND end_date IS NULL
      `, [project_id]);

    }

    await conn.commit();

    return { success: true };

  } catch (error) {

    await conn.rollback();
    throw error;

  } finally {

    conn.release();

  }

};

export const GetDashboardOverview = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM Project) AS total_projects,
      (SELECT COUNT(*) FROM Project WHERE status='Ongoing') AS ongoing_projects,
      (SELECT COUNT(*) FROM Project WHERE status='Completed') AS completed_projects,
      (SELECT COUNT(*) FROM Client) AS total_clients
  `;

  const [rows] = await db.query(query);
  return rows[0];
};


// helper queries

export const CheckClientExists = async (client_id) => {

  const query = `SELECT id FROM Client WHERE id=?`;
  return await ExecuteQuery(query, [client_id]);

};

export const CheckManagerExists = async (manager_id) => {

  const query = `
      SELECT u.id
      FROM User u
      JOIN User_Role ur ON ur.user_id = u.id
      JOIN Role r ON r.id = ur.role_id
      WHERE u.id = ?
      AND r.name = 'Project Manager'`;
  return await ExecuteQuery(query, [manager_id]);

};

export const CheckBudgetExists = async (budget_id) => {

  const query = `SELECT id FROM Project_Budget WHERE id=?`;
  return await ExecuteQuery(query, [budget_id]);

};