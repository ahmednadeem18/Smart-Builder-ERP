# Smart Builder ERP

## 1. Project Overview

**Group Number: 02** )

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
