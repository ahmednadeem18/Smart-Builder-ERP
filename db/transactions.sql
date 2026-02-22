-- transaction 1 in the ACID_Documentation

START TRANSACTION;

SELECT quantity
FROM Material_Inventory
WHERE category_id = 1
FOR UPDATE;

INSERT INTO Material_Allocation
(category_id, supplier_id, project_id, request_id, quantity)
VALUES (1,2,3,5,50);

COMMIT;


-- transaction 2 in the ACID_Documentation

-- Transaction 2: Invoice Approval

START TRANSACTION;

-- Lock invoice record
SELECT status
FROM Invoice_Request
WHERE id = 10
FOR UPDATE;

-- Approve invoice
UPDATE Invoice_Request
SET status = 'Approved'
WHERE id = 10;

-- Record revenue
INSERT INTO Revenue
(project_id, client_id, request_id, date, amount)
SELECT
    project_id,
    client_id,
    id,
    CURDATE(),
    amount
FROM Invoice_Request
WHERE id = 10;

COMMIT;