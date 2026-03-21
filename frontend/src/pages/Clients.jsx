import { useEffect, useState } from "react";
import { clientAPI } from "../api/axios";

export default function Clients() {
  const [clients,  setClients]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [selected, setSelected] = useState(null);
  const [details,  setDetails]  = useState({ projects: [], payments: [], invoices: [] });

  const loadClients = () => {
    clientAPI.getAll()
      .then(({ data }) => setClients(data.data ?? []))
      .catch(() => setError("Failed to load clients."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadClients(); }, []);

  const handleSelect = async (client) => {
    if (selected?.id === client.id) {
      setSelected(null);
      setDetails({ projects: [], payments: [], invoices: [] });
      return;
    }
    setSelected(client);
    const [pr, pa, inv] = await Promise.all([
      clientAPI.getProjects(client.id),
      clientAPI.getPayments(client.id),
      clientAPI.getInvoices(client.id),
    ]);
    setDetails({
      projects: pr.data.data ?? [],
      payments: pa.data.data ?? [],
      invoices: inv.data.data ?? [],
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="dashboard">

      <div className="page-header">
        <h2 className="page-heading">Clients</h2>
      </div>

      <div className="table-card">
        <h3 className="table-title">All Clients ({clients.length})</h3>
        {clients.length === 0 ? (
          <p className="empty">No clients found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => (
                <>
                  <tr key={c.id}>
                    <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td>{c.phone_number}</td>
                    <td>
                      <button className="btn-outline"
                        onClick={() => handleSelect(c)}>
                        {selected?.id === c.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {selected?.id === c.id && (
                    <tr key={`detail-${c.id}`}>
                      <td colSpan={4} style={{ background: "#f8fafc", padding: "16px 20px" }}>
                        <div className="client-details">

                          <div>
                            <p className="detail-label">Projects ({details.projects.length})</p>
                            {details.projects.length === 0 ? (
                              <p className="empty">No projects.</p>
                            ) : details.projects.map((p) => (
                              <p key={p.id} className="detail-item">
                                {p.project_name} — <span>{p.status}</span>
                              </p>
                            ))}
                          </div>

                          <div>
                            <p className="detail-label">Payments ({details.payments.length})</p>
                            {details.payments.length === 0 ? (
                              <p className="empty">No payments.</p>
                            ) : details.payments.map((p) => (
                              <p key={p.id} className="detail-item">
                                PKR {Number(p.amount).toLocaleString()} — <span>{p.status}</span>
                              </p>
                            ))}
                          </div>

                          <div>
                            <p className="detail-label">Invoices ({details.invoices.length})</p>
                            {details.invoices.length === 0 ? (
                              <p className="empty">No invoices.</p>
                            ) : details.invoices.map((inv) => (
                              <p key={inv.id} className="detail-item">
                                PKR {Number(inv.amount).toLocaleString()} — <span>{inv.status}</span>
                              </p>
                            ))}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}