CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE User_Role (
    user_id INT PRIMARY KEY,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (role_id) REFERENCES Role(id)
);

CREATE TABLE Client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    IBAN VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Project_Budget (
    id INT AUTO_INCREMENT PRIMARY KEY,
    labour_cost INT NOT NULL CHECK(labour_cost >= 0),
    material_cost INT NOT NULL CHECK(material_cost >= 0),
    equipment_rent INT NOT NULL CHECK(equipment_rent >= 0),
    subcontractor_cost INT NOT NULL CHECK(subcontractor_cost >= 0)
);

CREATE TABLE Project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    director_id INT NOT NULL,
    manager_id INT NOT NULL,
    budget_id INT NOT NULL UNIQUE,
    client_id INT NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('Ongoing','Completed','Cancelled')
        NOT NULL DEFAULT 'Ongoing',

    FOREIGN KEY (director_id) REFERENCES User(id),
    FOREIGN KEY (manager_id) REFERENCES User(id),
    FOREIGN KEY (budget_id) REFERENCES Project_Budget(id),
    FOREIGN KEY (client_id) REFERENCES Client(id),

    CHECK(end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE Progress_Log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    log_text TEXT NOT NULL,
    log_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES Project(id)
);

CREATE TABLE Expense_Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('labour','material','equipment','subcontractor') NOT NULL
);

-- here the reference to the receiver_id is missing
CREATE TABLE Payment_Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    category_id INT,
    receiver_id INT,
    user_id INT,
    amount INT NOT NULL CHECK(amount > 0),
    status ENUM('Requested','Approved')
        NOT NULL DEFAULT 'Requested',
    date DATE NOT NULL,

    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(category_id) REFERENCES Expense_Category(id),
    FOREIGN KEY(user_id) REFERENCES User(id)
);


-- here the reference to the receiver_id is missing again
CREATE TABLE Expense (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    category_id INT,
    receiver_id INT,
    request_id INT,
    date DATE NOT NULL,
    amount INT NOT NULL CHECK(amount > 0),

    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(category_id) REFERENCES Expense_Category(id),
    FOREIGN KEY(request_id) REFERENCES Payment_Request(id)
);

CREATE TABLE Invoice_Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    client_id INT,
    user_id INT,
    amount INT NOT NULL CHECK(amount > 0),
    status ENUM('Requested','Approved','Declined')
        NOT NULL DEFAULT 'Requested',
    req_date DATE NOT NULL,

    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(client_id) REFERENCES Client(id),
    FOREIGN KEY(user_id) REFERENCES User(id)
);

CREATE TABLE Revenue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    client_id INT,
    request_id INT,
    rev_date DATE NOT NULL,
    amount INT NOT NULL CHECK(amount > 0),

    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(client_id) REFERENCES Client(id),
    FOREIGN KEY(request_id) REFERENCES Invoice_Request(id)
);

CREATE TABLE HR_Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Human_Resource (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    gender ENUM('Male','Female','Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    cnic VARCHAR(13) NOT NULL UNIQUE,
    IBAN VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('Active','Inactive') NOT NULL
);

CREATE TABLE Skilled_Labour (
    hr_id INT PRIMARY KEY,
    category_id INT,
    daily_wage INT NOT NULL CHECK(daily_wage > 0),
    status ENUM('Free','Allocated') NOT NULL,

    FOREIGN KEY(hr_id) REFERENCES Human_Resource(id),
    FOREIGN KEY(category_id) REFERENCES HR_Category(id)
);


CREATE TABLE Unskilled_Labour (
    hr_id INT PRIMARY KEY,
    category_id INT NOT NULL,
    daily_wage INT NOT NULL CHECK(daily_wage > 0),
    status ENUM('Free','Allocated') NOT NULL,

    FOREIGN KEY(hr_id) REFERENCES Human_Resource(id),
    FOREIGN KEY(category_id) REFERENCES HR_Category(id)
);

CREATE TABLE Engineer (
    hr_id INT PRIMARY KEY, // i have to place it has primary key, else theres a syntax error!
    category_id INT NOT NULL,
    salary INT NOT NULL CHECK(salary > 0),

    FOREIGN KEY(hr_id) REFERENCES Human_Resource(id),
    FOREIGN KEY(category_id) REFERENCES HR_Category(id)
);

CREATE TABLE HR_Allocation_Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    user_id INT,
    status ENUM('Pending','Approved','Rejected') NOT NULL,

    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(category_id) REFERENCES HR_Category(id),
    FOREIGN KEY(user_id) REFERENCES User(id)
);

CREATE TABLE HR_Allocation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hr_id INT,
    project_id INT,
    request_id INT,
    start_date DATE NOT NULL,
    end_date DATE,

    FOREIGN KEY(hr_id) REFERENCES Human_Resource(id),
    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(request_id) REFERENCES HR_Allocation_Request(id),

    CHECK(end_date IS NULL OR end_date >= start_date)
);


CREATE TABLE Equipment_Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    status ENUM('Available','In-use','Under-maintenance')
        NOT NULL DEFAULT 'Available',
    ownership_type ENUM('Company-owned','Rented') NOT NULL,

    FOREIGN KEY(category_id) REFERENCES Equipment_Category(id)
);

CREATE TABLE Equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    status ENUM('Available','In-use','Under-maintenance')
        NOT NULL DEFAULT 'Available',
    ownership_type ENUM('Company-owned','Rented') NOT NULL,

    FOREIGN KEY(category_id) REFERENCES Equipment_Category(id)
);

CREATE TABLE Renter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    IBAN VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Rental_Details (
    equipment_id INT PRIMARY KEY,
    renter_id INT,
    start_date DATE NOT NULL,
    end_date DATE,
    total_rent INT NOT NULL CHECK(total_rent > 0),
    payment_status ENUM('Paid','Pending') NOT NULL,

    FOREIGN KEY(equipment_id) REFERENCES Equipment(id),
    FOREIGN KEY(renter_id) REFERENCES Renter(id)
);

CREATE TABLE Equipment_Allocation_Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    user_id INT,
    category_id INT,
    status ENUM('Pending','Approved','Rejected') NOT NULL,

    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(user_id) REFERENCES User(id),
    FOREIGN KEY(category_id) REFERENCES Equipment_Category(id)
);

CREATE TABLE Equipment_Allocation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT,
    project_id INT,
    request_id INT,
    start_date DATE NOT NULL,
    end_date DATE,

    FOREIGN KEY(equipment_id) REFERENCES Equipment(id),
    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(request_id)
        REFERENCES Equipment_Allocation_Request(id)
);

CREATE TABLE Material_Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('Cement','Steel','Sand','Bricks','Other') NOT NULL,
    unit ENUM('kg','ton','bag','piece','m3') NOT NULL
);

CREATE TABLE Supplier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    IBAN VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Material_Shipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    supplier_id INT,
    quantity INT NOT NULL CHECK(quantity > 0),
    price INT NOT NULL CHECK(price > 0),
    payment_status ENUM('Paid','Pending') NOT NULL,

    FOREIGN KEY(category_id) REFERENCES Material_Category(id),
    FOREIGN KEY(supplier_id) REFERENCES Supplier(id)
);

CREATE TABLE Material_Inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    shipment_id INT,
    quantity INT NOT NULL CHECK(quantity >= 0),

    FOREIGN KEY(category_id) REFERENCES Material_Category(id),
    FOREIGN KEY(shipment_id) REFERENCES Material_Shipment(id)
);

CREATE TABLE Material_Allocation_Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    project_id INT,
    user_id INT,
    quantity INT NOT NULL CHECK(quantity > 0),
    status ENUM('Pending','Approved','Rejected') NOT NULL,

    FOREIGN KEY(category_id) REFERENCES Material_Category(id),
    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(user_id) REFERENCES User(id)
);

CREATE TABLE Material_Allocation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    supplier_id INT,
    project_id INT,
    request_id INT,
    quantity INT NOT NULL CHECK(quantity > 0),

    FOREIGN KEY(category_id) REFERENCES Material_Category(id),
    FOREIGN KEY(supplier_id) REFERENCES Supplier(id),
    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(request_id) REFERENCES Material_Allocation_Request(id)
);

CREATE TABLE Subcontractor_Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('Electrical','Plumbing','Civil','Finishing') NOT NULL
);

CREATE TABLE Subcontractor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    number VARCHAR(20) NOT NULL,
    IBAN VARCHAR(50) UNIQUE NOT NULL,

    FOREIGN KEY(category_id) REFERENCES Subcontractor_Category(id)
);

CREATE TABLE Subcontractor_Allocation_Request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    category_id INT,
    user_id INT,
    status ENUM('Pending','Approved','Rejected'),

    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(category_id) REFERENCES Subcontractor_Category(id),
    FOREIGN KEY(user_id) REFERENCES User(id)
);

CREATE TABLE Subcontractor_Allocation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subcontractor_id INT,
    project_id INT,
    request_id INT,
    payment_status ENUM('Requested','Approved')
        DEFAULT 'Requested',
    price INT NOT NULL CHECK(price > 0),

    FOREIGN KEY(subcontractor_id) REFERENCES Subcontractor(id),
    FOREIGN KEY(project_id) REFERENCES Project(id),
    FOREIGN KEY(request_id) REFERENCES Subcontractor_Allocation_Request(id)
);


-- indexes


-- it will speeds up the queries in retreiving projects belonging to a specific client.
-- it will be used in the client dashboard.
CREATE INDEX idx_project_client
ON Project(client_id);

-- it will speeds up the queries while viewing the project managed by a specific project manager.
-- it will be frequently used in manager role views.
CREATE INDEX idx_project_manager
ON Project(manager_id);

-- it will improve performance when fetching progress history of a project.
CREATE INDEX idx_progress_project
ON Progress_Log(project_id);

-- it will accelerate expense aggregation and financial summaries of a project.
CREATE INDEX idx_expense_project
ON Expense(project_id);

-- it will enhance approval workflow queries
CREATE INDEX idx_payment_project
ON Payment_Request(project_id);

-- it will optimize retrieval of workers that are allocated to a particular project.
CREATE INDEX idx_hr_project
ON HR_Allocation(project_id);

-- it will improve tracking of assignment history of an every human resource.
CREATE INDEX idx_hr_person
ON HR_Allocation(hr_id);

-- it will speed equipment allocation lookup for projects during availability checks.
CREATE INDEX idx_equipment_project
ON Equipment_Allocation(project_id);



DELIMITER //

CREATE TRIGGER target_equipment_inuse
AFTER INSERT ON Equipment_Allocation
FOR EACH ROW
BEGIN
    UPDATE Equipment
    SET status = 'In-use'
    WHERE id = NEW.equipment_id;
END//


CREATE TRIGGER target_update_inventory
AFTER INSERT ON Material_Allocation
FOR EACH ROW
BEGIN
    UPDATE Material_Inventory
    SET quantity = quantity - NEW.quantity
    WHERE category_id = NEW.category_id;
END//

CREATE TRIGGER target_project_created
AFTER INSERT ON Project
FOR EACH ROW
BEGIN
    INSERT INTO Progress_Log (
        project_id,
        log_text,
        date
    )
    VALUES (
        NEW.id,
        CONCAT(
            'Project created: ',
            NEW.project_name,
            ' | Status: ',
            NEW.status
        ),
        NOW()
    );
END//

CREATE TRIGGER target_project_updates
AFTER UPDATE ON Project
FOR EACH ROW
BEGIN

    -- log if the status of the project is changed
    IF OLD.status <> NEW.status THEN
        INSERT INTO Progress_Log(project_id, log_text, date)
        VALUES (
            NEW.id,
            CONCAT(
                'Project status changed from ',
                OLD.status,
                ' to ',
                NEW.status
            ),
            NOW()
        );
    END IF;

    -- log if the end date is changed of the project
    IF OLD.end_date <> NEW.end_date THEN
        INSERT INTO Progress_Log(project_id, log_text, date)
        VALUES (
            NEW.id,
            CONCAT(
                'Project end date updated to ',
                NEW.end_date
            ),
            NOW()
        );
    END IF;
END //


DELIMITER ;

