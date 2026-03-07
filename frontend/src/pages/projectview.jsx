
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

import React, { useEffect, useState } from "react";

export default function MaterialTest() {
  const [stock, setStock] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectMaterials, setProjectMaterials] = useState([]);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000/admin/materials"; // adjust if needed

  // Fetch stock
  const fetchStock = async () => {
    try {
      const res = await fetch(`${API_BASE}/stock`);
      const data = await res.json();
      setStock(data.data || data); // depends on your backend JSON structure
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch shipments
  const fetchShipments = async () => {
    try {
      const res = await fetch(`${API_BASE}/shipments`);
      const data = await res.json();
      setShipments(data.data || data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch project-wise allocation
  const fetchProjectMaterials = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`${API_BASE}/project/${projectId}`);
      const data = await res.json();
      setProjectMaterials(data.data || data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Material Dashboard Test</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={fetchStock}>Get Current Stock</button>
      <ul>
        {stock.map((m) => (
          <li key={m.id}>
            {m.name} ({m.unit}): {m.total_stock}
          </li>
        ))}
      </ul>

      <button onClick={fetchShipments}>Get All Shipments</button>
      <ul>
        {shipments.map((s) => (
          <li key={s.id}>
            {s.material} from {s.supplier}: {s.quantity} @ {s.price} [{s.payment_status}]
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button onClick={fetchProjectMaterials}>Get Project Materials</button>
      </div>
      <ul>
        {projectMaterials.map((pm, index) => (
          <li key={index}>
            {pm.project_name} → {pm.material}: {pm.quantity} {pm.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}