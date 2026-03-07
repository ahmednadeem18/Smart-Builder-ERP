

INSERT INTO Account_Details (IBAN, bank_name, holder_name) VALUES
('PK00HBL0000123456789', 'HBL', 'Ali Khan'),
('PK00UBL0000234567890', 'UBL', 'Sara Ahmed'),
('PK00MCB0000345678901', 'MCB', 'Bilal Qureshi'),
('PK00ABL0000456789012', 'ABL', 'Ayesha Siddiqui'),
('PK00SCB0000567890123', 'SCB', 'Omar Farooq');

INSERT INTO Role (name) VALUES
('Director'),
('Project Manager'),
('Finance Officer'),
('HR Officer'),
('Site Engineer');

INSERT INTO Expense_Category (name) VALUES
('labour'), ('material'), ('equipment'), ('subcontractor');

INSERT INTO HR_Category (name) VALUES
('Civil Engineer'), ('Electrical Engineer'), ('Plumber'), ('Electrician'), ('Carpenter');

INSERT INTO Equipment_Category (name) VALUES
('Excavator'), ('Crane'), ('Bulldozer'), ('Concrete Mixer'), ('Drill');

INSERT INTO Material_Category (name, unit) VALUES
('Cement','bag'), ('Steel','ton'), ('Sand','m3'), ('Bricks','piece');

INSERT INTO Subcontractor_Category (name) VALUES
('Electrical'), ('Plumbing'), ('Civil'), ('Finishing');


INSERT INTO User (username, email, password) VALUES
('ahmed_director','ahmed.director@gmail.com','ahmed123'),
('fatima_pm','fatima.pm@gmail.com','fatima123'),
('bilal_finance','bilal.finance@hotmail.com','bilal123'),
('sara_hr','sara.hr@gmail.com','sara123'),
('omar_engineer','omar.engineer@hotmail.com','omar123'),
('ali_worker','ali.worker@hotmail.com','pass123'),
('hassan_worker','hassan.worker@gmail.com','hassan123'),
('ayesha_worker','ayesha.worker@gmail.com','ayesha123'),
('naveed_worker','naveed.worker@gmail.com','naveed123'),
('iman_worker','iqra.worker@gmail.com','iman123');

INSERT INTO User_Role (user_id, role_id) VALUES
(1,1), -- Ahmed: Director
(2,2), -- Fatima: Project Manager
(3,3), -- Bilal: Finance
(4,4), -- Sara: HR Officer
(5,5), -- Omar: Engineer
(6,4), (7,4), (8,4), (9,4), (10,4); -- Workers: assigned HR roles



INSERT INTO Client (name, phone_number, account_id) VALUES
('Habib Builders','0306578902',1),
('Descon Construction','03136524347',2),
('FWO Contractors','03248787942',3),
('ZKB Engineers','03037619101',4),
('Nespak Projects','03040198981',5),
('Al-Hamd Constructions','03067579319',1),
('Rashid Builders','03337613237',2),
('Pak Steel Projects','03328967878',3);

INSERT INTO Human_Resource (name, gender, date_of_birth, cnic, account_id, status) VALUES
('Ahmed Ali','Male','1980-03-12','4210123456789',1,'Active'),
('Sara Khan','Female','1985-06-24','4210123456790',2,'Active'),
('Bilal Qureshi','Male','1990-01-15','4210123456791',3,'Active'),
('Fatima Siddiqui','Female','1992-12-05','4210123456792',4,'Active'),
('Omar Farooq','Male','1988-07-30','4210123456793',5,'Active'),
('Ayesha Tariq','Female','1995-09-10','4210123456794',1,'Active'),
('Naveed Hussain','Male','1994-04-21','4210123456795',2,'Active'),
('Iqra Ahmed','Female','1996-11-19','4210123456796',3,'Active'),
('Hassan Ali','Male','1993-08-22','4210123456797',4,'Active'),
('Ali Raza','Male','1991-05-18','4210123456798',5,'Active');


INSERT INTO Subcontractor (category_id, name,number, account_id) VALUES
(1,'Pak Electricals','03178938769',1),
(2,'Blue Plumbing','03337819682',2),
(3,'FWO Civil Works','03249898767',3),
(4,'Al-Hamd Finishing','03378342313',4),
(1,'ZKB Electric','03249878542',5),
(2,'Nova Plumbing','03335645090',1),
(3,'Descon Civil','03337867005',2),
(4,'Habib Finishing','03337682563',3),
(1,'Rashid Electrical','03244760012',4);


INSERT INTO Supplier (name, account_id) VALUES
('FWO Cement Supply',1),
('SteelCo Ltd',2),
('SandMart',3),
('BrickMasters',4),
('Concrete Solutions',5),
('Nova Materials',1),
('ZKB Suppliers',2),
('Habib Supplies',3);

INSERT INTO Renter (name, account_id) VALUES
('Excavator Rentals',1),
('Crane Hire Co',2),
('Bulldozer Services',3),
('MixMaster Rentals',4),
('DrillPro Ltd',5);



INSERT INTO Project_Budget (labour_cost, material_cost, equipment_rent, subcontractor_cost) VALUES
(50000,150000,30000,40000),
(60000,120000,25000,35000),
(45000,130000,20000,30000),
(70000,160000,40000,50000),
(55000,140000,35000,45000),
(60000,125000,30000,40000),
(65000,135000,32000,42000),
(48000,110000,25000,38000),
(52000,115000,28000,39000),
(50000,120000,30000,40000);


INSERT INTO Project (director_id, manager_id, budget_id, client_id, project_name, start_date, end_date, status) VALUES
(1,2,1,1,'Habib Mall Construction','2025-01-01','2025-12-31','Ongoing'),
(1,2,2,2,'Descon Tower','2025-02-01','2025-11-30','Ongoing'),
(1,2,3,3,'FWO Housing','2025-03-01','2025-09-30','Ongoing'),
(1,2,4,4,'ZKB Office','2025-01-15','2025-10-31','Ongoing'),
(1,2,5,5,'Nespak Project Center','2025-02-20','2025-12-15','Ongoing'),
(1,2,6,6,'Al-Hamd Plaza','2025-03-10','2025-12-20','Ongoing'),
(1,2,7,7,'Rashid Apartments','2025-01-05','2025-11-30','Ongoing'),
(1,2,8,8,'Pak Steel Warehouse','2025-04-01','2025-12-31','Ongoing'),
(1,2,9,1,'Habib Factory Extension','2025-05-01','2025-12-30','Ongoing'),
(1,2,10,2,'Descon Villa Project','2025-06-01','2025-12-15','Ongoing');

INSERT INTO Equipment (category_id, name, status, ownership_type) VALUES
(1,'Excavator ZX200','Available','Company-owned'),
(2,'Crane LTM1200','Available','Company-owned'),
(3,'Bulldozer D6','Available','Rented'),
(4,'Concrete Mixer CM300','Available','Rented'),
(5,'DrillMaster 500','Available','Company-owned'),
(1,'Excavator ZX150','Available','Company-owned'),
(2,'Crane LTM800','Available','Rented'),
(3,'Bulldozer D5','Available','Company-owned'),
(4,'Concrete Mixer CM200','Available','Rented'),
(5,'DrillMaster 300','Available','Company-owned');

INSERT INTO Payment_Request (project_id, category_id, user_id, amount, status, date) VALUES
(1,1,3,20000,'Requested','2025-01-15'),
(2,2,3,15000,'Approved','2025-02-20'),
(3,3,3,10000,'Requested','2025-03-10'),
(4,4,3,18000,'Approved','2025-01-25'),
(5,1,3,22000,'Requested','2025-02-28');

INSERT INTO Expense (project_id, category_id, request_id, date, amount) VALUES
(1,1,1,'2025-01-20',20000),
(2,2,2,'2025-02-25',15000),
(3,3,3,'2025-03-15',10000),
(4,4,4,'2025-01-30',18000),
(5,1,5,'2025-03-05',22000);

INSERT INTO Material_Shipment (category_id, supplier_id, quantity, price, payment_status) VALUES
(11,1,500,50000,'Paid'),    -- Cement
(12,2,20,120000,'Paid'),    -- Steel
(13,3,100,30000,'Pending'), -- Sand
(14,4,2000,50000,'Paid'),   -- Bricks
(11,5,50,40000,'Pending'),  -- Cement
(12,6,400,40000,'Paid'),    -- Steel
(13,7,25,130000,'Pending'), -- Sand
(14,8,150,35000,'Paid');    -- Bricks

INSERT INTO Material_Inventory (category_id, shipment_id, quantity) VALUES
(11,33,500),
(12, 34,20),
(13,35,100),
(14,36,2000),
(11,33,50),
(12,36,400),
(13,37,25),
(14,38,150);

INSERT INTO HR_Category (name) VALUES
('Civil Engineer'),
('Electrical Engineer'),
('Plumber'),
('Mason'),
('Welder'),
('Carpenter'),
('Painter'),
('Electrician');


INSERT INTO Skilled_Labour (hr_id, category_id, daily_wage, status) VALUES
(1,1,100,'Free'),
(2,2,120,'Allocated'),
(3,3,90,'Free');


INSERT INTO Unskilled_Labour (hr_id, category_id, daily_wage, status) VALUES
(4,4,60,'Free'),
(5,5,70,'Allocated'),
(6,6,65,'Free');

INSERT INTO Engineer (hr_id, category_id, salary) VALUES
(7,1,120000),
(8,2,110000);


INSERT INTO Equipment_Allocation_Request (project_id, user_id, category_id, status) VALUES
(1,3,1,'Pending'),
(2,3,2,'Approved'),
(3,3,3,'Approved');


INSERT INTO Equipment_Allocation (equipment_id, project_id, request_id, start_date, end_date) VALUES
(1,1,1,'2025-01-10','2025-01-20'),
(2,2,2,'2025-02-01','2025-02-15'),
(3,3,3,'2025-03-05','2025-03-25');

INSERT INTO Material_Allocation_Request (category_id, project_id, user_id, quantity, status) VALUES
(13,1,3,100,'Approved'),
(14,2,3,50,'Pending'),
(11,3,3,200,'Approved');



INSERT INTO Material_Allocation (category_id, supplier_id, project_id, request_id, quantity) VALUES
(11,1,1,4,100), 
(13,3,3,5,50),
(14,4,1,5,150),
(11,5,2,6,50), 
(12,6,3,6,100), 
(13,7,1,4,25),5
(14,8,2,5,100); 

INSERT INTO Invoice_Request (project_id, client_id, user_id, amount, status, req_date) VALUES
(1,1,3,50000,'Requested','2025-01-15'),
(2,2,3,60000,'Approved','2025-02-20'),
(3,3,3,40000,'Requested','2025-03-10');

INSERT INTO Revenue (project_id, client_id, request_id, rev_date, amount) VALUES
(1,1,1,'2025-01-25',50000),
(2,2,2,'2025-02-28',60000),
(3,3,3,'2025-03-20',40000);

INSERT INTO Subcontractor_Allocation_Request (project_id, category_id, user_id, status) VALUES
(1,1,3,'Approved'),
(2,2,3,'Pending'),
(3,3,3,'Approved');


INSERT INTO Subcontractor_Allocation (subcontractor_id, project_id, request_id, payment_status, price) VALUES
(1,1,1,'Approved',20000),
(2,2,2,'Requested',15000),
(3,3,3,'Approved',18000);

INSERT INTO Rental_Details (equipment_id, renter_id, start_date, end_date, total_rent, payment_status) VALUES
(3,3,'2025-01-05','2025-01-20',50000,'Paid'),  -- Bulldozer D6
(4,4,'2025-02-01','2025-02-15',40000,'Pending'),-- Concrete Mixer CM300
(7,2,'2025-03-10','2025-03-25',30000,'Paid'),  -- Crane LTM800
(10,5,'2025-04-01','2025-04-20',35000,'Pending'); -- DrillMaster 300

INSERT INTO HR_Allocation_Request (project_id, category_id, user_id, status) VALUES
(1,1,4,'Approved'),
(2,2,4,'Pending'),
(3,3,4,'Approved'),
(4,4,4,'Approved'),
(5,1,4,'Pending');

INSERT INTO HR_Allocation (hr_id, project_id, request_id, start_date, end_date) VALUES
(1,1,1,'2025-01-10','2025-06-10'),
(2,2,2,'2025-02-01','2025-07-01'),
(3,3,3,'2025-03-05','2025-09-05'),
(4,4,4,'2025-01-15','2025-06-15'),
(5,5,5,'2025-02-20','2025-08-20');


select * FROM Project;

SELECT
    c.id,
    c.name,
    c.phone_number,
    ad.bank_name,
    ad.holder_name
    FROM Client c
    LEFT JOIN Account_Details ad
    ON c.account_id = ad.id;
  