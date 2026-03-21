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
    console.log("Updating project:", project_id, "to status:", status);
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

export const GetProjectFullReport = async (id) => {
  id = parseInt(id);
  //console.log("Getting report for project id:", id, typeof id);

  // Basic project info + budget
  const [project] = await db.query(`
    SELECT
      p.id, p.project_name, p.start_date, p.end_date, p.status,
      c.name AS client_name,
      d.username AS director_name,
      m.username AS manager_name,
      pb.labour_cost, pb.material_cost,
      pb.equipment_rent, pb.subcontractor_cost,
      (pb.labour_cost + pb.material_cost + pb.equipment_rent + pb.subcontractor_cost) AS planned_budget
    FROM Project p
    JOIN Client c ON p.client_id = c.id
    JOIN User d ON p.director_id = d.id
    JOIN User m ON p.manager_id = m.id
    JOIN Project_Budget pb ON p.budget_id = pb.id
    WHERE p.id = ?
  `, [id]);
    //console.log("Project result:", project);
  // Workers 1
  const [workers] = await db.query(`
    SELECT
      hr.name, hr.gender,
      CASE
        WHEN sl.hr_id IS NOT NULL THEN 'Skilled Labour'
        WHEN ul.hr_id IS NOT NULL THEN 'Unskilled Labour'
        WHEN e.hr_id  IS NOT NULL THEN 'Engineer'
        ELSE 'Unknown'
      END AS type,
      COALESCE(sl.daily_wage, ul.daily_wage, e.salary) AS rate,
      ha.start_date, ha.end_date,
      COALESCE(sl.status, ul.status) AS status
    FROM HR_Allocation ha
    JOIN Human_Resource hr ON ha.hr_id = hr.id
    LEFT JOIN Skilled_Labour sl   ON sl.hr_id = hr.id
    LEFT JOIN Unskilled_Labour ul ON ul.hr_id = hr.id
    LEFT JOIN Engineer e          ON e.hr_id  = hr.id
    WHERE ha.project_id = ?
  `, [id]);
  // console.log("workers result:", workers);

  // Equipment
  const [equipment] = await db.query(`
    SELECT
      eq.name, ec.name AS category,
      eq.ownership_type, eq.status,
      ea.start_date, ea.end_date
    FROM Equipment_Allocation ea
    JOIN Equipment eq ON ea.equipment_id = eq.id
    JOIN Equipment_Category ec ON eq.category_id = ec.id
    WHERE ea.project_id = ?
  `, [id]);

  // Materials 1
  const [materials] = await db.query(`
    SELECT
      mc.name AS material, mc.unit,
      ma.quantity,
      s.name AS supplier
    FROM Material_Allocation ma
    JOIN Material_Category mc ON ma.category_id = mc.id
    JOIN Supplier s ON ma.supplier_id = s.id
    WHERE ma.project_id = ?
  `, [id]);
  // console.log("materials result:", materials);

  // Subcontractors 1
  const [subcontractors] = await db.query(`
    SELECT
      sub.name, sc.name AS category,
      sa.price, sa.payment_status
    FROM Subcontractor_Allocation sa
    JOIN Subcontractor sub ON sa.subcontractor_id = sub.id
    JOIN Subcontractor_Category sc ON sub.category_id = sc.id
    WHERE sa.project_id = ?
  `, [id]);
    // console.log("subcontractors result:", subcontractors);

  // Actual expenses 1

  const [expenses] = await db.query(`
    SELECT
      ec.name AS category,
      SUM(e.amount) AS total
    FROM Expense e
    JOIN Expense_Category ec ON e.category_id = ec.id
    WHERE e.project_id = ?
    GROUP BY ec.name
  `, [id]);
    // console.log("expenses result:", expenses);

  return {
    project: project[0],
    workers,
    equipment,
    materials,
    subcontractors,
    expenses,
  };
};

export const GetUsersByRole = async (role) => {
  const [rows] = await db.query(`
    SELECT u.id, u.username
    FROM User u
    JOIN User_Role ur ON ur.user_id = u.id
    JOIN Role r ON r.id = ur.role_id
    WHERE r.name = ?
  `, [role]);
  return rows;
};