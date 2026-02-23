
EXPLAIN ANALYZE  SELECT t1.id, t1.project_name, t2.name AS client_name, 
t3.labour_cost + t3.material_cost + t3.equipment_rent + t3.subcontractor_cost AS total_budget,
    IFNULL(SUM(t4.amount), 0) AS total_expense,
    IFNULL(SUM(t5.amount), 0) AS total_revenue
FROM Project t1
JOIN Client t2 ON t1.client_id = t2.id 
JOIN Project_Budget t3 ON t1.budget_id = t3.id
LEFT JOIN Expense t4 ON t1.id = t4.project_id
LEFT JOIN Revenue t5 ON t1.id = t5.project_id
WHERE t1.id = 10
GROUP BY t1.id;

EXPLAIN ANALYZE SELECT t2.project_name, 
t3.name AS client_name, t4.status, t1.amount, t1.rev_date
FROM Revenue t1
JOIN Project t2 ON t1.project_id = t2.id
JOIN Client t3 ON t1.client_id = t3.id
JOIN Invoice_Request t4 ON t1.request_id = t4.id
ORDER BY t1.rev_date DESC;


EXPLAIN ANALYZE SELECT t2.project_name, t3.name AS worker_name, t4.name AS category, t1.start_date
FROM HR_Allocation t1
JOIN Project t2 ON t1.project_id = t2.id
JOIN Human_Resource t3 ON t1.hr_id = t3.id
JOIN HR_Category t4 ON t4.id = 1
WHERE t1.project_id <= 5;