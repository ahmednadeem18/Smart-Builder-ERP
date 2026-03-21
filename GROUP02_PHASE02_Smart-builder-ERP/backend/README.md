# Construction Project Management API


# Prerequisites

Before running the project, install:

* **Node.js (v18 or later recommended)**
* **MariaDB / MySQL**
* **npm**

Check installations:


node -v
npm -v
mysql --version




# Installation

## 1. Clone the Repository


git clone https://github.com/ahmednadeem18/Smart-Builder-ERP
cd project-folder


---

## 2. Install Dependencies

```
npm install
```

This installs all required packages such as:

* express
* jsonwebtoken
* mysql2
* crypto
* dotenv

---

## 3. Create Environment Variables

Create a `.env` file in the project root.

Example:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=construction_db

JWT_SECRET=your_secret_key


# Running the Server

Start the server with:


npm start

Server will start at:


http://localhost:5000



# API Base URL

All APIs are versioned:

http://localhost:5000/api/v1/


Example endpoints:

POST /api/v1/auth/login
GET  /api/v1/admin/projects
POST /api/v1/admin/projects
PATCH /api/v1/admin/projects/:id/status
GET  /api/v1/admin/clients
POST /api/v1/admin/clients

