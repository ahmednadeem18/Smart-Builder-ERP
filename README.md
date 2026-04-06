# Smart Builder ERP

## 0. Quick Demo
For a quick demo visit following production link:
https://smartbuildererp.vercel.app/login
(deployed)
## 1. Project Overview

**Group Number: 02**

**Team Members:**
| Name | Roll Number |
|------|-------------|
| Rana Abdul Moeez | BSCS24106 |
| Ahmed Nadeem | BSCS24129 |
| Rohail Ashraf | BSCS24090 |

---

### What is Smart Builder ERP?

Smart Builder ERP is a web-based Enterprise Resource Planning system
built specifically for construction companies. It provides a unified
platform for directors, managers, and department heads to oversee
all aspects of construction operations from a single interface.

### Problem It Solves

Construction companies manage multiple moving parts simultaneously,
projects, budgets, workers, materials, equipment, subcontractors, and
client invoices. Without a centralised system, this leads to:

- Budget overruns going unnoticed until it is too late
- Resources being double-allocated or left idle
- Payment approvals delayed due to lack of visibility
- No single source of truth for project progress

Smart Builder ERP solves this by providing role-based dashboards where
every stakeholder, from the Director down to a department manager, 
sees exactly what they need and can act on it immediately.

### Domain

Construction project management, covering project lifecycle tracking,
multi-resource allocation (human resources, materials, equipment,
subcontractors), financial management, and client billing.

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI framework |
| Vite | 7.3.1 | Build tool and dev server |
| React Router DOM | 7.13.1 | Client-side routing and protected routes |
| Axios | 1.13.6 | HTTP client for API calls |
| jsPDF | 4.2.1 | PDF report generation |
| html2canvas | 1.4.1 | HTML to canvas for PDF export |
| Plain CSS | — | Custom styling (no UI library) |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 10.9.4 | Runtime environment |
| Express.js | — | REST API framework |
| mysql2 | — | MySQL driver with connection pooling |
| jsonwebtoken | — | JWT token signing and verification |
| crypto (built-in) | — | SHA-256 password hashing |
| swagger-ui-express | 5.0.1 | API documentation UI |
| dotenv | — | Environment variable management |
| cors | — | Cross-origin request handling |

### Database
| Technology | Purpose |
|------------|---------|
| MySQL (Aiven cloud) | Primary relational database |

### Deployment
| Service | Purpose |
|---------|---------|
| Render | Backend hosting |
| Vercel | Frontend hosting |

## 3. System Architecture

### Overview

Smart Builder ERP follows a classic three-tier architecture:

- **Frontend** (Vercel)  :  React app built with Vite. Handles UI,
  routing, and API calls via Axios.
- **Backend** (Render) : Node.js + Express REST API. Handles
  authentication, business logic, and database queries.
- **Database** (Aiven Cloud) : MySQL. Stores all application data.

### How They Interact

1. User opens the React app on Vercel
2. React sends HTTP requests to the Express backend on Render
3. Every request carries a JWT token in the Authorization header
4. Backend validates the token, checks the user role, runs the
   business logic, queries MySQL, and returns a JSON response
5. React updates the UI based on the response

### Backend Layer Structure
Each layer has one job:

- **Routes** — register URL paths and attach middleware
- **Middleware** — verify JWT token and check user role
- **Controllers** — extract request data, call service, send response
- **Services** — business logic and validation rules
- **Repositories** — raw SQL queries against the database

### Key Design Decisions

- Raw SQL used instead of an ORM for full query control
- Stateless JWT authentication — no server-side sessions
- SHA-256 password hashing using Node.js built-in crypto module
- Single shared MySQL database for all modules


## 4. UI Examples

### 4.1 Login Page

Overview  
The Login Page is the entry point of the system where users authenticate using their credentials.

UI Description
- Center-aligned login form for focused user interaction
- Input fields:
  - Username
  - Password
- Login button to submit credentials
- Displays error messages for invalid login attempts

How It Works
- User submits credentials via the login form
- Frontend sends request: POST /auth/login
- On success:
  - JWT token is returned and stored on the client
  - User is redirected to their role-based dashboard
- Token validation: GET /auth/verify

Why It Is Required
- Ensures secure system access
- Enables role-based authentication
- Protects all backend resources from unauthorized users

---

### 4.2 Director Dashboard

Overview  
The Director Dashboard provides a high-level summary of all operations, allowing monitoring and decision-making.

UI Description
- Summary cards:
  - Total Projects
  - Total Clients
  - Ongoing Projects
  - Completed Projects
- Project table displaying all projects
- Sidebar navigation for modules:
  - Projects
  - Clients
  - Materials
  - Other system components

How It Works
- Dashboard data: GET /admin/dashboard-overview
- Project list: GET /admin/projects
- Additional operations:
  - Create Project → POST /admin/projects
  - Update Status → PATCH /admin/projects/:id/status
  - View Budget → GET /admin/projects/:id/budget
  - Generate Report → GET /admin/projects/:id/report
  - Password change: PUT /auth/change-password


Why It Is Required
- Provides centralized visibility of system data
- Helps in tracking project performance
- Enables faster managerial decision-making

---

### 4.3 Project Management Page

Overview  
The Project Management Page allows the Admin to create, monitor, and control all projects within the system.

UI Description
- Table displaying all projects with:
  - Project Name
  - Client
  - Status (Ongoing/Completed)
  - Budget
- Action buttons:
  - Create Project
  - Update Status
  - View Budget
  - Generate Report
- Form modal for creating new projects

How It Works
- Fetch all projects: GET /admin/projects
- Create a new project: POST /admin/projects
- Update project status: PATCH /admin/projects/:id/status
- Retrieve project budget: GET /admin/projects/:id/budget
- Generate project report: GET /admin/projects/:id/report

Why It Is Required
- Core functionality of the ERP system
- Enables full lifecycle management of projects
- Integrates financial tracking and reporting
- Ensures efficient project monitoring and control

## 5. Setup & Installation

### Prerequisites

Ensure the following are installed on your system:

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- MySQL Server (or access to Aiven MySQL cloud instance)
- Git (optional, for cloning repository)

---

### Environment Variables

#### Backend (.env)

Create a `.env` file inside the backend directory and configure:

PORT=5000  
DB_HOST=your_database_host  
DB_USER=your_database_user  
DB_PASSWORD=your_database_password  
DB_NAME=your_database_name  
DB_PORT=your_database_port  

FRONTEND_URL=http://localhost:5173  

JWT_SECRET=your_secret_key  
JWT_EXPIRES_IN=1h 

Explanation:
- PORT → Backend server port
- DB_HOST → Database host (Aiven or local)
- DB_USER → MySQL username
- DB_PASSWORD → MySQL password
- DB_NAME → Database name
- DB_PORT → MySQL port (default: 3306 or Aiven port)
- FRONTEND_URL → Allowed frontend origin (CORS)
- JWT_SECRET → Secret key for signing tokens
- JWT_EXPIRES_IN → Token expiry duration

---

#### Frontend (.env)

Create a `.env` file inside the frontend directory:

VITE_API_URL=https://your-backend-url  
VITE_API_URL_LOCAL=http://localhost:5000  

Explanation:
- VITE_API_URL → Production backend URL
- VITE_API_URL_LOCAL → Local backend URL for development

---

### Installation Steps

#### 1. Clone Repository

git clone https://github.com/ahmednadeem18/Smart-Builder-ERP.git  
cd smart-builder-erp  

---

#### 2. Backend Setup

cd backend  
npm install  

---

#### 3. Frontend Setup

cd ../frontend  
npm install  

---

### Database Initialization(For Academic Purposes Only)

#### Step 1: Create Connection

Establish a fully functional MYSQL or MariaDB setup on your local machine and than create a connection with the credentials, provided in the environment file.

#### Step 2: Import Schema

Run your full schema.sql file (tables, triggers, views, indexes)

#### Step 3: Seed Data

Run seed.sql to populate:
- Users
- Roles
- Projects
- Resources (HR, Equipment, Materials)
- Sample transactions

---

### Running the Application

#### Start Backend

cd backend  
npm run dev  
 

Backend will run on:
http://localhost:5000  

---

#### Start Frontend

cd frontend  
npm run dev  

Frontend will run on:
http://localhost:5173  

---

### Notes

- Passwords are automatically hashed using SHA-256 via database triggers
- JWT authentication is required for all protected routes
- Ensure backend is running before starting frontend
- If using Aiven cloud, verify IP whitelist and credentials

---
## 6. User Roles

The system follows a **role-based access control (RBAC)** model where each user is assigned a specific role that determines their permissions and accessible features.

---

### 6.1 Administrator / Director

**Overview**  
The Administrator (Director) has full system access and is responsible for overall system governance and monitoring.

**Responsibilities**
- Assign roles to users
- Create and manage projects
- Assign Project Managers to projects
- View system-wide dashboards and analytics
- Monitor all modules (HR, Finance, Materials, Equipment, Subcontractors)

**Access Level**
- Full access to all system functionalities
- Can view and control all resources and transactions

---

### 6.2 Project Manager

**Overview**  
The Project Manager is responsible for managing the execution of assigned projects.

**Responsibilities**
- Request allocation of:
  - Human Resources
  - Equipment
  - Materials
  - Subcontractors
- Monitor project progress via logs
- Manage day-to-day project activities

**Access Level**
- Limited to assigned projects only
- Cannot approve financial transactions

---

### 6.3 Finance Manager

**Overview**  
The Finance Manager handles all financial operations within the
system.

**Responsibilities**
- Approve or reject payment requests
- Record expenses
- Generate invoices
- Track revenues and financial summaries

**Access Level**
- Full access to financial modules
- No control over HR, materials, or equipment allocation

---

### 6.4 Procurement & Inventory Manager

**Overview**  
Responsible for material procurement and inventory control.

**Responsibilities**
- Manage suppliers
- Approve/reject material allocation requests
- Maintain inventory levels
- Request payment approvals for suppliers

**Access Level**
- Full access to material and inventory modules
- Cannot manage HR or financial approvals directly

---

### 6.5 HR Manager

**Overview**  
Handles human resource management and workforce allocation.

**Responsibilities**
- Hire and manage employees
- Allocate workers to projects based on requests
- Handle employee-related payment approvals

**Access Level**
- Full access to HR module
- Limited to workforce-related operations

---

### 6.6 Equipment Manager

**Overview**  
Responsible for managing equipment availability and allocation.

**Responsibilities**
- Maintain equipment inventory
- Allocate equipment to projects
- Arrange rentals if equipment is unavailable
- Request payment approvals for rentals

**Access Level**
- Full access to equipment module
- No access to HR or financial decision-making

---

### 6.7 Subcontractor Manager

**Overview**  
Manages subcontractors and their allocation to projects.

**Responsibilities**
- Maintain subcontractor records
- Assign subcontractors to projects
- Request payment approvals for subcontractor services

**Access Level**
- Full access to subcontractor module
- Limited to subcontractor-related operations

---

## Feature Walkthrough

| Feature | Description | Role(s) | API Endpoint / Page |
|---------|-------------|---------|------------------|
| **Login / Authentication** | Allows users to log in and verify access rights. | All users | `authAPI.login`, `authAPI.verify` |
| **Change Password** | Lets users update their password. | All users | `authAPI.changePassword` |
| **Dashboard Overview** | Displays key metrics and KPIs for the organization. | Administrator, Director | `adminAPI.getDashboard` |
| **Project Management** | Create, update, and monitor projects. Track progress, budgets, and reports. | Administrator, Director, Project Manager | `adminAPI.createProject`, `adminAPI.updateProjectStatus`, `adminAPI.getProjectBudget`, `adminAPI.getProjectReport`, `pmAPI.getMyProjects` |
| **User Management** | View users by role and assign roles. | Administrator, Director | `adminAPI.getUsersByRole` |
| **Client Management** | Create client accounts, view client projects, payments, and invoices. | Administrator, Director | `clientAPI.createWithAccount`, `clientAPI.getAll`, `clientAPI.getProjects`, `clientAPI.getPayments`, `clientAPI.getInvoices` |
| **Finance Management** | Track expenses, revenues, approve payments and invoices. | Finance Manager | `financeAPI.getExpenses`, `financeAPI.getRevenues`, `financeAPI.getPendingPayments`, `financeAPI.getPendingInvoices`, `financeAPI.approvePayment`, `financeAPI.approveInvoice` |
| **HR / Resource Management** | View available resources, submit and approve requests, free labor allocation. | HR Manager | `hrAPI.getResources`, `hrAPI.getPendingRequests`, `hrAPI.createRequest`, `hrAPI.approveRequest`, `hrAPI.freeLabour` |
| **Material / Inventory Management** | Track stock, shipments, suppliers, approve allocation requests, batch management. | Procurement / Inventory Manager | `materialAPI.getStock`, `materialAPI.getShipments`, `materialAPI.getSuppliers`, `materialAPI.getPendingRequests`, `materialAPI.getBatches`, `materialAPI.createRequest`, `materialAPI.createShipment`, `materialAPI.approveBatch` |
| **Equipment Management** | Maintain equipment stock, approve requests, track rented vs owned equipment. | Equipment Manager | `equipmentAPI.getAll`, `equipmentAPI.getRented`, `equipmentAPI.getOwned`, `equipmentAPI.getPendingRequests`, `equipmentAPI.approveRequest` |
| **Project Logs & Requests** | Add project logs, submit allocation requests for resources, materials, and subcontractors. | Project Manager | `pmAPI.getProjectLogs`, `pmAPI.addLog`, `pmAPI.submitRequest` |
| **Subcontractor Management** | Maintain subcontractor list, assign them to projects, approve payment requests. | Subcontractor Manager | `subcontractorAPI.getPendingRequests`, `subcontractorAPI.getByCategory`, `subcontractorAPI.createRequest`, `subcontractorAPI.approve` |

## 8. Transaction Scenarios

The system uses transactional operations to ensure data consistency across multiple related actions.

---

### 8.1 Project Creation Transaction

**Trigger**  
When a Director creates a new project.

**Operations (Atomic)**
- Insert into Project_Budget
- Insert into Project
- Trigger automatically logs creation in Progress_Log

**Rollback Condition**
- If any insert fails (budget or project), the entire transaction is rolled back

**Related Components**
- API: POST /admin/projects
- Database Trigger: target_project_created

---

### 8.2 Material Allocation Transaction

**Trigger**  
When material allocation is approved.

**Operations (Atomic)**
- Insert into Material_Allocation
- Trigger updates Material_Inventory (reduces quantity)

**Rollback Condition**
- If inventory update fails, allocation is not committed

**Related Components**
- API: Material allocation endpoint
- Trigger: target_update_inventory

---

### 8.3 Project Completion Transaction

**Trigger**  
When a project status is updated to 'Completed'

**Operations (Atomic)**
- Update Project status
- Trigger release all allocated workers (set to 'Free')

**Rollback Condition**
- If any update fails, status change is not committed

**Related Components**
- API: PATCH /admin/projects/:id/status
- Trigger: release_workers_after_project_completion

---

## 9. ACID Compliance

The system ensures ACID properties through database constraints, triggers, and transactional control.

| Property   | Implementation |
|-----------|--------------|
| Atomicity | Transactions ensure all related operations (e.g., allocation + inventory update) succeed or fail together |
| Consistency | Enforced via constraints (CHECK, FOREIGN KEY, UNIQUE) and triggers |
| Isolation | MySQL default isolation level ensures concurrent transactions do not interfere |
| Durability | Data is persisted in MySQL (Aiven cloud), ensuring recovery after failures |

---

### Concrete Examples

- **Atomicity** → Material allocation + inventory deduction via trigger  
- **Consistency** → CHECK constraints (amount > 0, dates validation)  
- **Isolation** → Concurrent allocation requests handled safely by DB engine  
- **Durability** → Cloud database ensures persistent storage  

---

## 10. Indexing & Performance

Indexes are used to optimize query performance for frequently accessed data.

---

### Indexes Implemented

- idx_project_client → Speeds up project retrieval by client  
- idx_progress_project → Optimizes fetching project logs  
- idx_expense_project → Improves expense aggregation queries  
- idx_payment_project → Enhances payment approval queries  
- idx_hr_project → Speeds HR allocation lookup by project  
- idx_hr_person → Improves tracking of individual worker history  
- idx_equipment_project → Optimizes equipment allocation queries  

---

### Performance Impact

**Before Indexing**
- Full table scans for joins and filters
- Slower response for dashboards and reports

**After Indexing**
- Faster query execution using indexed lookups
- Improved performance in:
  - Dashboard loading
  - Financial summaries
  - Allocation tracking

---

### Summary

Indexing significantly reduces query execution time and improves system responsiveness, especially for large datasets involving joins and aggregations.

---
## 11. API Reference

This section provides a concise overview of the main API endpoints. Full details are available in swagger.yaml.

---

### Authentication

`POST /auth/login `Login user and return JWT  
`GET /auth/verify ` Verify JWT token  
`PUT /auth/change-password` Change user password  

---
### Admin / Director

`GET /admin/dashboard-overview` Get system dashboard summary  
`GET /admin/projects` Retrieve all projects  
`POST /admin/projects` Create a new project  
`PATCH /admin/projects/:id/status` Update project status  
`GET /admin/projects/:id/budget` Get project budget  
`GET /admin/projects/:id/report` Generate project report  
`GET /admin/users?role=` Get users filtered by role  

---

### Client Management

`POST /admin/clients/create` Create client with account details  
`POST /admin/clients` Create client  
`GET /admin/clients` Get all clients  
`GET /admin/clients/:id` Get single client  
`GET /admin/clients/:id/projects` Get client projects  
`GET /admin/clients/:id/payments` Get client payments  
`GET /admin/clients/:id/invoices` Get client invoices  

---

### Finance

`GET /admin/finance/expenses` Retrieve all expenses  
`GET /admin/finance/revenues` Retrieve all revenues  
`GET /admin/finance/payments/pending` Get pending payment requests  
`GET /admin/finance/invoices/pending` Get pending invoice requests  
`POST /admin/finance/payment/approve/:id` Approve payment request  
`POST /admin/finance/invoice/approve/:id` Approve invoice request  

---

### Human Resource (HR)

`GET /hr/resources` Get all human resources  
`GET /hr/requests/pending` Get pending HR requests  
`POST /hr/request` Create HR allocation request  
`POST /hr/approve` Approve HR allocation  
`POST /hr/free` Release allocated labour  

---

### Material Management

`GET /material/stock` Get material inventory stock  
`GET /material/shipments` Get material shipments  
`GET /material/suppliers` Get suppliers  
`GET /material/requests/pending` Get pending material requests  
`GET /material/inventory-batches` Get inventory batches  
`POST /material/request` Create material request  
`POST /material/shipment/manual` Add shipment manually  
`POST /material/approve-batch` Approve material allocation  

---

### Equipment Management

`GET /equipment/all` Get all equipment  
`GET /equipment/rented` Get rented equipment  
`GET /equipment/owned` Get owned equipment  
`GET /equipment/requests/pending` Get pending equipment requests  
`POST /equipment/approve` Approve equipment allocation  

---

### Project Manager

`GET /pm/projects` Get assigned projects  
`GET /pm/project/logs/:projectId` Get project logs  
`POST /pm/log` Add project log  
`POST /pm/request/:type` Submit resource request  

---

### Subcontractor Management

`POST /subcontractor/request` Create subcontractor request  
`GET /subcontractor/requests/pending` Get pending requests  
`GET /subcontractor/list/:categoryId` Get subcontractors by category  
`POST /subcontractor/approve` Approve subcontractor allocation  

---
### 12 Known Issues and Limitations

Even with a complete implementation, ERP systems face several inherent conceptual limitations:

---

## 12.1 High System Complexity  
ERP systems integrate multiple modules (HR, Finance, Inventory, Projects), which makes them complex to design, maintain, and scale. Changes in one module can impact others due to tight coupling.

---

### 12.2 Missing Foreign Key Constraints

- Some fields like `receiver_id` were initially not properly constrained
- Later adjustments replaced them with `account_id`
- Some legacy inconsistencies may still exist

---

## 12.3 Centralized Dependency Risk
ERP acts as a single source of truth. If the system fails (server/database downtime), all operations across departments are affected.

---

## 12.4 Security and Access Control Complexity

Managing fine-grained role-based permissions across multiple modules becomes complex and error-prone as the system will grow.
### 12.5 No Real-Time Updates

- System does not use WebSockets or live updates
- Users must refresh to see updated data
---

### Summary
Despite these limitations, the system successfully implements all core ERP functionalities including role-based access control, resource management, financial tracking, and project lifecycle management.