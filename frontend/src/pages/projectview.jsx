
// -----------------------------------------------------------------------dashboard overview---------------------------------------------------------------------
// import React, { useEffect, useState } from "react";

// export default function ProjectOverview() {
//   const [projects, setProjects] = useState([]);
//   const [overview, setOverview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch projects
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/admin/projects");
//         if (!res.ok) throw new Error("Failed to fetch projects");
//         const data = await res.json();
//         setProjects(data.data || []);
//       } catch (err) {
//         setError(err.message);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Fetch dashboard overview
//   useEffect(() => {
//     const fetchOverview = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/admin/dashboard-overview");
//         if (!res.ok) throw new Error("Failed to fetch overview");
//         const data = await res.json();
//         setOverview(data.data || {});
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOverview();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div>
//       <h1>Admin Dashboard Overview</h1>

//       {overview && (
//         <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//           <div style={{ padding: "10px", border: "1px solid black" }}>
//             <h3>Total Projects</h3>
//             <p>{overview.total_projects}</p>
//           </div>
//           <div style={{ padding: "10px", border: "1px solid black" }}>
//             <h3>Ongoing Projects</h3>
//             <p>{overview.ongoing_projects}</p>
//           </div>
//           <div style={{ padding: "10px", border: "1px solid black" }}>
//             <h3>Completed Projects</h3>
//             <p>{overview.completed_projects}</p>
//           </div>
//           <div style={{ padding: "10px", border: "1px solid black" }}>
//             <h3>Total Clients</h3>
//             <p>{overview.total_clients}</p>
//           </div>
//         </div>
//       )}

//       <h2>All Projects</h2>
//       <table border="1" cellPadding="5">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Status</th>
//             <th>Start</th>
//             <th>End</th>
//           </tr>
//         </thead>
//         <tbody>
//           {projects.map((p) => (
//             <tr key={p.id}>
//               <td>{p.id}</td>
//               <td>{p.project_name}</td>
//               <td>{p.status}</td>
//               <td>{p.start_date}</td>
//               <td>{p.end_date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h2>Raw JSON</h2>
//       <pre>{JSON.stringify({ overview, projects }, null, 2)}</pre>
//     </div>
//   );
// }


// // src/pages/ClientTest.jsx----------------------------------------------------------------------------------------------------------------------------------------------------------------
// import React, { useState, useEffect } from "react";

// const BASE_URL = "http://localhost:5000/admin/clients";

// const ClientTest = () => {
//   const [allClients, setAllClients] = useState([]);
//   const [clientDetails, setClientDetails] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const clientIdToTest = 1; // change this to a valid client id in your DB

//   useEffect(() => {
//     // Fetch all clients
//     fetch(`${BASE_URL}`)
//       .then((res) => res.json())
//       .then((data) => setAllClients(data.data))
//       .catch(console.error);

//     // Fetch specific client
//     fetch(`${BASE_URL}/${clientIdToTest}`)
//       .then((res) => res.json())
//       .then((data) => setClientDetails(data.data))
//       .catch(console.error);

//     // Fetch projects of client
//     fetch(`${BASE_URL}/${clientIdToTest}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data.data))
//       .catch(console.error);

//     // Fetch payments of client
//     fetch(`${BASE_URL}/${clientIdToTest}/payments`)
//       .then((res) => res.json())
//       .then((data) => setPayments(data.data))
//       .catch(console.error);

//     // Fetch invoices of client
//     fetch(`${BASE_URL}/${clientIdToTest}/invoices`)
//       .then((res) => res.json())
//       .then((data) => setInvoices(data.data))
//       .catch(console.error);
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Clients Unit Test</h2>

//       <h3>All Clients</h3>
//       <pre>{JSON.stringify(allClients, null, 2)}</pre>

//       <h3>Client Details (ID: {clientIdToTest})</h3>
//       <pre>{JSON.stringify(clientDetails, null, 2)}</pre>

//       <h3>Projects of Client</h3>
//       <pre>{JSON.stringify(projects, null, 2)}</pre>

//       <h3>Payments of Client</h3>
//       <pre>{JSON.stringify(payments, null, 2)}</pre>

//       <h3>Invoices of Client</h3>
//       <pre>{JSON.stringify(invoices, null, 2)}</pre>
//     </div>
//   );
// };

// export default ClientTest;

// import React, { useEffect, useState } from "react";

// export default function MaterialTest() {
//   const [stock, setStock] = useState([]);
//   const [shipments, setShipments] = useState([]);
//   const [projectId, setProjectId] = useState("");
//   const [projectMaterials, setProjectMaterials] = useState([]);
//   const [error, setError] = useState("");

//   const API_BASE = "http://localhost:5000/admin/materials"; // adjust if needed

//   // Fetch stock
//   const fetchStock = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/stock`);
//       const data = await res.json();
//       setStock(data.data || data); // depends on your backend JSON structure
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Fetch shipments
//   const fetchShipments = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/shipments`);
//       const data = await res.json();
//       setShipments(data.data || data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Fetch project-wise allocation
//   const fetchProjectMaterials = async () => {
//     if (!projectId) return;
//     try {
//       const res = await fetch(`${API_BASE}/project/${projectId}`);
//       const data = await res.json();
//       setProjectMaterials(data.data || data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Material Dashboard Test</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <button onClick={fetchStock}>Get Current Stock</button>
//       <ul>
//         {stock.map((m) => (
//           <li key={m.id}>
//             {m.name} ({m.unit}): {m.total_stock}
//           </li>
//         ))}
//       </ul>

//       <button onClick={fetchShipments}>Get All Shipments</button>
//       <ul>
//         {shipments.map((s) => (
//           <li key={s.id}>
//             {s.material} from {s.supplier}: {s.quantity} @ {s.price} [{s.payment_status}]
//           </li>
//         ))}
//       </ul>

//       <div style={{ marginTop: "20px" }}>
//         <input
//           type="number"
//           placeholder="Project ID"
//           value={projectId}
//           onChange={(e) => setProjectId(e.target.value)}
//         />
//         <button onClick={fetchProjectMaterials}>Get Project Materials</button>
//       </div>
//       <ul>
//         {projectMaterials.map((pm, index) => (
//           <li key={index}>
//             {pm.project_name} → {pm.material}: {pm.quantity} {pm.unit}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

//--------------------------------------------------------------------------login test

// import { useState } from "react";

// export default function AuthTest() {

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [token, setToken] = useState("");
//   const [response, setResponse] = useState(null);

//   const API = "http://localhost:5000/api/v1/auth";

//   const handleLogin = async () => {

//     try {

//       const res = await fetch(`${API}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           username,
//           password
//         })
//       });

//       const data = await res.json();

//       setResponse(data);

//       if (data?.data?.token) {
//         setToken(data.data.token);
//       }

//       console.log("Login Response:", data);

//     } catch (error) {
//       console.error(error);
//     }

//   };

//   const handleVerify = async () => {

//     try {

//       const res = await fetch(`${API}/verify`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const data = await res.json();

//       setResponse(data);

//       console.log("Verify Response:", data);

//     } catch (error) {
//       console.error(error);
//     }

//   };

//   return (

//     <div style={{ padding: "40px", fontFamily: "Arial" }}>

//       <h2>Authentication Test UI</h2>

//       <h3>Login</h3>

//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e)=>setUsername(e.target.value)}
//         style={{ padding: "8px", width: "250px" }}
//       />

//       <br/><br/>

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e)=>setPassword(e.target.value)}
//         style={{ padding: "8px", width: "250px" }}
//       />

//       <br/><br/>

//       <button
//         onClick={handleLogin}
//         style={{ padding: "10px 20px", cursor: "pointer" }}
//       >
//         Login
//       </button>

//       <hr style={{ margin: "40px 0" }}/>

//       <h3>Verify Token</h3>

//       <p><b>Token:</b></p>

//       <textarea
//         value={token}
//         onChange={(e)=>setToken(e.target.value)}
//         rows="4"
//         cols="60"
//       />

//       <br/><br/>

//       <button
//         onClick={handleVerify}
//         style={{ padding: "10px 20px", cursor: "pointer" }}
//       >
//         Verify Token
//       </button>

//       <hr style={{ margin: "40px 0" }}/>

//       <h3>Server Response</h3>

//       <pre
//         style={{
//           background: "#f4f4f4",
//           padding: "15px",
//           borderRadius: "6px"
//         }}
//       >
//         {JSON.stringify(response, null, 2)}
//       </pre>

//     </div>

//   );

// }

// -------------------------------------------------------------------------------------------------------------------------
import { useState } from "react";

const API = "http://localhost:5000/api/v1";

export default function ProjectWorkflowTest() {

const [token, setToken] = useState("");
const [projects, setProjects] = useState([]);

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const [projectName, setProjectName] = useState("");
const [directorId, setDirectorId] = useState("");
const [managerId, setManagerId] = useState("");
const [clientId, setClientId] = useState("");
const [startDate, setStartDate] = useState("");

const [labourCost, setLabourCost] = useState("");
const [materialCost, setMaterialCost] = useState("");
const [equipmentRent, setEquipmentRent] = useState("");
const [subcontractorCost, setSubcontractorCost] = useState("");

const [statusProjectId, setStatusProjectId] = useState("");
const [status, setStatus] = useState("");

// LOGIN
const login = async () => {

const res = await fetch(API + "/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username,
    password
  })
});

const data = await res.json();

console.log("Login Response:", data);

if (data.success) {
  setToken(data.data.token);
  alert("Login Successful");
} else {
  alert(data.message);
}

};

// LOAD PROJECTS
const loadProjects = async () => {

const res = await fetch(API + "/admin/projects", {
  headers: {
    Authorization: "Bearer " + token
  }
});

const data = await res.json();

console.log("Projects:", data);

if (data.success) {
  setProjects(data.data);
}
};

// CREATE PROJECT (WITH BUDGET TRANSACTION)
const createProject = async () => {

const res = await fetch(API + "/admin/projects", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  },
  body: JSON.stringify({
    project_name: projectName,
    director_id: directorId,
    manager_id: managerId,
    client_id: clientId,
    start_date: startDate,
    labour_cost: labourCost,
    material_cost: materialCost,
    equipment_rent: equipmentRent,
    subcontractor_cost: subcontractorCost
  })
});

const data = await res.json();

console.log("Create Project:", data);

alert(data.message);

};

// UPDATE STATUS
const updateStatus = async () => {


const res = await fetch(
  API + "/admin/projects/" + statusProjectId + "/status",
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      status
    })
  }
);

const data = await res.json();

console.log("Update Status:", data);

alert(data.message);

};

return (
<div style={{ padding: "40px", fontFamily: "Arial" }}>

  <h1>Project Workflow Test</h1>

  {/* LOGIN */}
  <h2>1. Login</h2>

  <input
    placeholder="Username"
    onChange={(e) => setUsername(e.target.value)}
  />

  <br /><br />

  <input
    type="password"
    placeholder="Password"
    onChange={(e) => setPassword(e.target.value)}
  />

  <br /><br />

  <button onClick={login}>Login</button>

  <hr />

  {/* VIEW PROJECTS */}
  <h2>2. View Projects</h2>

  <button onClick={loadProjects}>Load Projects</button>

  <ul>
    {projects.map((p) => (
      <li key={p.id}>
        {p.project_name} — {p.status}
      </li>
    ))}
  </ul>

  <hr />

  {/* CREATE PROJECT WITH BUDGET */}
  <h2>3. Create Project (Transaction)</h2>

  <input
    placeholder="Project Name"
    onChange={(e) => setProjectName(e.target.value)}
  />

  <br /><br />

  <input
    placeholder="Director ID"
    onChange={(e) => setDirectorId(e.target.value)}
  />

  <br /><br />

  <input
    placeholder="Manager ID"
    onChange={(e) => setManagerId(e.target.value)}
  />

  <br /><br />

  <input
    placeholder="Client ID"
    onChange={(e) => setClientId(e.target.value)}
  />

  <br /><br />

  <input
    type="date"
    onChange={(e) => setStartDate(e.target.value)}
  />

  <h3>Budget</h3>

  <input
    placeholder="Labour Cost"
    onChange={(e) => setLabourCost(e.target.value)}
  />

  <br /><br />

  <input
    placeholder="Material Cost"
    onChange={(e) => setMaterialCost(e.target.value)}
  />

  <br /><br />

  <input
    placeholder="Equipment Rent"
    onChange={(e) => setEquipmentRent(e.target.value)}
  />

  <br /><br />

  <input
    placeholder="Subcontractor Cost"
    onChange={(e) => setSubcontractorCost(e.target.value)}
  />

  <br /><br />

  <button onClick={createProject}>Create Project</button>

  <hr />

  {/* UPDATE PROJECT STATUS */}
  <h2>4. Update Project Status</h2>

  <input
    placeholder="Project ID"
    onChange={(e) => setStatusProjectId(e.target.value)}
  />

  <br /><br />

  <input
    placeholder="Status (Ongoing / Completed / Cancelled)"
    onChange={(e) => setStatus(e.target.value)}
  />

  <br /><br />

  <button onClick={updateStatus}>Update Status</button>

</div>

);
}


// ---------------------------------------------------------------------------------------------------------------------------------------------------
// import { useState, useEffect } from "react";

// const API = "http://localhost:5000/api/v1";

// export default function ClientView() {

// const [token, setToken] = useState("");
// const [clients, setClients] = useState([]);

// const [name, setName] = useState("");
// const [phone, setPhone] = useState("");
// const [accountId, setAccountId] = useState("");

// const [username, setUsername] = useState("");
// const [password, setPassword] = useState("");

// // LOGIN
// const login = async () => {


// const res = await fetch(API + "/auth/login", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     username,
//     password
//   })
// });

// const data = await res.json();

// if (data.success) {

//   setToken(data.data.token);

//   alert("Login Successful");

// } else {
//   alert(data.message);
// }

// };

// // LOAD CLIENTS
// const loadClients = async () => {

// const res = await fetch(API + "/admin/clients", {
//   headers: {
//     Authorization: "Bearer " + token
//   }
// });

// const data = await res.json();

// if (data.success) {
//   setClients(data.data);
// }

// };

// // CREATE CLIENT
// const createClient = async () => {

// const res = await fetch(API + "/admin/clients", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + token
//   },
//   body: JSON.stringify({
//     name,
//     phone_number: phone,
//     account_id: accountId
//   })
// });

// const data = await res.json();

// alert(data.message);

// loadClients();


// };

// return (
// <div style={{ padding: "40px", fontFamily: "Arial" }}>

//   <h1>Client Management</h1>

//   <h2>Login</h2>

//   <input
//     placeholder="Username"
//     onChange={(e) => setUsername(e.target.value)}
//   />

//   <br /><br />

//   <input
//     type="password"
//     placeholder="Password"
//     onChange={(e) => setPassword(e.target.value)}
//   />

//   <br /><br />

//   <button onClick={login}>Login</button>

//   <hr />

//   <h2>Clients</h2>

//   <button onClick={loadClients}>Load Clients</button>

//   <ul>
//     {clients.map((c) => (
//       <li key={c.id}>
//         {c.name} — {c.phone_number}
//       </li>
//     ))}
//   </ul>

//   <hr />

//   <h2>Add New Client</h2>

//   <input
//     placeholder="Client Name"
//     onChange={(e) => setName(e.target.value)}
//   />

//   <br /><br />

//   <input
//     placeholder="Phone Number"
//     onChange={(e) => setPhone(e.target.value)}
//   />

//   <br /><br />

//   <input
//     placeholder="Account ID"
//     onChange={(e) => setAccountId(e.target.value)}
//   />

//   <br /><br />

//   <button onClick={createClient}>Create Client</button>

// </div>

// );
// }

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// import { useState } from "react";

// const API = "http://localhost:5000/api/v1";

// export default function PMView() {

// const [token, setToken] = useState("");

// const [username, setUsername] = useState("");
// const [password, setPassword] = useState("");

// const [projects, setProjects] = useState([]);
// const [logs, setLogs] = useState([]);

// const [projectId, setProjectId] = useState("");
// const [updateText, setUpdateText] = useState("");
// const [requestType, setRequestType] = useState("material");


// // LOGIN
// const login = async () => {

// const res = await fetch(API + "/auth/login", {
// method: "POST",
// headers: {
// "Content-Type": "application/json"
// },
// body: JSON.stringify({
// username,
// password
// })
// });

// const data = await res.json();

// if (data.success) {

// setToken(data.data.token);

// alert("Login Successful");

// } else {

// alert(data.message);

// }

// };


// // LOAD PROJECTS (for logged in manager)
// const loadProjects = async () => {

// const res = await fetch(API + "/pm/projects", {
// headers: {
// Authorization: "Bearer " + token
// }
// });

// const data = await res.json();

// if (data.success) {
// setProjects(data.data);
// }

// };


// // LOAD PROJECT LOGS
// const loadLogs = async () => {

// const res = await fetch(API + "/pm/project/logs/" + projectId, {
// headers: {
// Authorization: "Bearer " + token
// }
// });

// const data = await res.json();

// if (data.success) {
// setLogs(data.data);
// }

// };


// // ADD PROGRESS LOG
// const addLog = async () => {

// const res = await fetch(API + "/pm/log", {
// method: "POST",
// headers: {
// "Content-Type": "application/json",
// Authorization: "Bearer " + token
// },
// body: JSON.stringify({
// projectId,
// update: updateText
// })
// });

// const data = await res.json();

// alert(data.message);

// };


// // SUBMIT RESOURCE REQUEST
// const requestResource = async () => {

// const res = await fetch(API + "/pm/request/" + requestType, {
// method: "POST",
// headers: {
// "Content-Type": "application/json",
// Authorization: "Bearer " + token
// },
// body: JSON.stringify({
// projectId,
// description: "Request from UI"
// })
// });

// const data = await res.json();

// alert(data.message);

// };


// return (

// <div style={{ padding: "40px", fontFamily: "Arial" }}>

// <h1>Project Manager Dashboard</h1>


// <h2>Login</h2>

// <input
// placeholder="Username"
// onChange={(e) => setUsername(e.target.value)}
// />

// <br /><br />

// <input
// type="password"
// placeholder="Password"
// onChange={(e) => setPassword(e.target.value)}
// />

// <br /><br />

// <button onClick={login}>Login</button>

// <hr />


// <h2>My Projects</h2>

// <button onClick={loadProjects}>Load My Projects</button>

// <ul>

// {projects.map((p) => (

// <li key={p.id}>

// {p.name} — {p.status}

// </li>

// ))}

// </ul>

// <hr />


// <h2>Project Logs</h2>

// <input
// placeholder="Project ID"
// onChange={(e) => setProjectId(e.target.value)}
// />

// <br /><br />

// <button onClick={loadLogs}>Load Logs</button>

// <ul>

// {logs.map((l) => (

// <li key={l.id}>
// {l.update}
// </li>

// ))}

// </ul>

// <hr />


// <h2>Add Progress Update</h2>

// <input
// placeholder="Project ID"
// onChange={(e) => setProjectId(e.target.value)}
// />

// <br /><br />

// <input
// placeholder="Update Text"
// onChange={(e) => setUpdateText(e.target.value)}
// />

// <br /><br />

// <button onClick={addLog}>Add Log</button>

// <hr />


// <h2>Request Resource</h2>

// <input
// placeholder="Project ID"
// onChange={(e) => setProjectId(e.target.value)}
// />

// <br /><br />

// <select onChange={(e) => setRequestType(e.target.value)}>
// <option value="material">Material</option>
// <option value="staff">Staff</option>
// <option value="equipment">Equipment</option>
// </select>

// <br /><br />

// <button onClick={requestResource}>Submit Request</button>

// </div>

// );

// }