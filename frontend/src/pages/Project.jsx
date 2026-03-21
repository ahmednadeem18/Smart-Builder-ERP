import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, clientAPI } from "../api/axios";
import { useAuth } from "../context/authcontext";

const STATUS_OPTIONS = ["Ongoing", "Completed", "Cancelled"];

function StatusBadge({ status }) {
        const styles = {
                Ongoing: { color: "#2563eb", background: "#eff6ff" },
                Completed: { color: "#16a34a", background: "#f0fdf4" },
                Cancelled: { color: "#dc2626", background: "#fef2f2" },
        };
        const s = styles[status] ?? { color: "#64748b", background: "#f1f5f9" };
        return (
                <span style={{
                        ...s,
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                }}>
                        {status}
                </span>
        );
}

export default function Projects() {
        const { user } = useAuth();
        const navigate = useNavigate();

        const [projects, setProjects] = useState([]);
        const [clients, setClients] = useState([]);
        const [managers, setManagers] = useState([]);
        const [directors, setDirectors] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [showForm, setShowForm] = useState(false);

        const [form, setForm] = useState({
                project_name: "",
                director_id: "",
                manager_id: "",
                client_id: "",
                new_client_name: "",
                new_client_phone: "",
                new_client_iban: "",
                client_mode: "existing",
                start_date: "",
                labour_cost: "",
                material_cost: "",
                equipment_rent: "",
                subcontractor_cost: "",
        });

        const [formError, setFormError] = useState("");
        const [formLoading, setFormLoading] = useState(false);

        const loadProjects = () => {
                adminAPI.getProjects()
                        .then(({ data }) => setProjects(data.data ?? []))
                        .catch(() => setError("Failed to load projects."))
                        .finally(() => setLoading(false));
        };

        useEffect(() => {
                loadProjects();
                clientAPI.getAll()
                        .then(({ data }) => setClients(data.data ?? []));
                adminAPI.getUsersByRole("Project Manager")
                        .then(({ data }) => setManagers(data.data ?? []));
                adminAPI.getUsersByRole("Director")
                        .then(({ data }) => setDirectors(data.data ?? []));
        }, []);

        const handleChange = (e) => {
                setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleCreate = async (e) => {
                e.preventDefault();
                console.log("client_mode:", form.client_mode);
                console.log("form:", form);
                setFormError("");
                setFormLoading(true);

                try {
                        let client_id = form.client_id;

                        // Create new client if needed
                        if (form.client_mode === "new") {
                                console.log("Creating new client...");
                                const res = await clientAPI.createWithAccount({
                                        name: form.new_client_name,
                                        phone_number: form.new_client_phone,
                                        IBAN: form.new_client_iban,
                                        bank_name: form.new_client_bank,
                                        holder_name: form.new_client_holder,
                                });
                                console.log("Client response:", res.data);
                                client_id = res.data.data?.id;
                                console.log("Client ID:", client_id);
                        }

                        await adminAPI.createProject({
                                project_name: form.project_name,
                                director_id: Number(form.director_id),
                                manager_id: Number(form.manager_id),
                                client_id: Number(client_id),
                                start_date: form.start_date,
                                labour_cost: Number(form.labour_cost),
                                material_cost: Number(form.material_cost),
                                equipment_rent: Number(form.equipment_rent),
                                subcontractor_cost: Number(form.subcontractor_cost),
                        });

                        setShowForm(false);
                        setForm({
                                project_name: "", director_id: "", manager_id: "",
                                client_id: "", new_client_name: "", new_client_phone: "",
                                new_client_iban: "", client_mode: "existing", start_date: "",
                                labour_cost: "", material_cost: "", equipment_rent: "", subcontractor_cost: "",
                        });
                        loadProjects();
                } catch (err) {
                        setFormError(err.response?.data?.message || "Failed to create project.");
                } finally {
                        setFormLoading(false);
                }
        };

        const handleStatusChange = async (id, status) => {
                try {
                        await adminAPI.updateProjectStatus(id, status);
                        loadProjects();
                } catch {
                        alert("Failed to update status.");
                }
        };

        if (loading) return <p>Loading...</p>;
        if (error) return <p className="error">{error}</p>;

        return (
                <div className="dashboard">

                        <div className="page-header">
                                <h2 className="page-heading">Projects</h2>
                                {user?.role === "Director" && (
                                        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                                                {showForm ? "Cancel" : "+ New Project"}
                                        </button>
                                )}
                        </div>

                        {showForm && (
                                <div className="form-card">
                                        <h3 className="form-title">Create New Project</h3>
                                        <form onSubmit={handleCreate} className="project-form">

                                                <div className="form-group">
                                                        <label>Project Name</label>
                                                        <input name="project_name" value={form.project_name}
                                                                onChange={handleChange} placeholder="Project name" />
                                                </div>

                                                {/* Director */}
                                                <div className="form-group">
                                                        <label>Director</label>
                                                        <select name="director_id" value={form.director_id} onChange={handleChange}>
                                                                <option value="">Select director</option>
                                                                {directors.map((d) => (
                                                                        <option key={d.id} value={d.id}>{d.username}</option>
                                                                ))}
                                                        </select>
                                                </div>

                                                {/* Manager */}
                                                <div className="form-group">
                                                        <label>Project Manager</label>
                                                        <select name="manager_id" value={form.manager_id} onChange={handleChange}>
                                                                <option value="">Select manager</option>
                                                                {managers.map((m) => (
                                                                        <option key={m.id} value={m.id}>{m.username}</option>
                                                                ))}
                                                        </select>
                                                </div>

                                                {/* Client */}
                                                <div className="form-group">
                                                        <label>Client</label>
                                                        <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                                                                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 400 }}>
                                                                        <input type="radio" name="client_mode" value="existing"
                                                                                checked={form.client_mode === "existing"} onChange={handleChange} />
                                                                        Existing Client
                                                                </label>
                                                                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 400 }}>
                                                                        <input type="radio" name="client_mode" value="new"
                                                                                checked={form.client_mode === "new"} onChange={handleChange} />
                                                                        New Client
                                                                </label>
                                                        </div>

                                                        {form.client_mode === "existing" ? (
                                                                <select name="client_id" value={form.client_id} onChange={handleChange}>
                                                                        <option value="">Select client</option>
                                                                        {clients.map((c) => (
                                                                                <option key={c.id} value={c.id}>{c.name}</option>
                                                                        ))}
                                                                </select>
                                                        ) : (
                                                                <div className="project-form">
                                                                        <input name="new_client_name" value={form.new_client_name}
                                                                                onChange={handleChange} placeholder="Client name" />
                                                                        <input name="new_client_phone" value={form.new_client_phone}
                                                                                onChange={handleChange} placeholder="Phone number" />
                                                                        <input name="new_client_iban" value={form.new_client_iban}
                                                                                onChange={handleChange} placeholder="IBAN" />
                                                                        <input name="new_client_bank" value={form.new_client_bank ?? ""}
                                                                                onChange={handleChange} placeholder="Bank name" />
                                                                        <input name="new_client_holder" value={form.new_client_holder ?? ""}
                                                                                onChange={handleChange} placeholder="Account holder name" />
                                                                </div>
                                                        )}
                                                </div>

                                                <div className="form-group">
                                                        <label>Start Date</label>
                                                        <input name="start_date" type="date" value={form.start_date}
                                                                onChange={handleChange} />
                                                </div>

                                                <div className="form-row">
                                                        <div className="form-group">
                                                                <label>Labour Cost</label>
                                                                <input name="labour_cost" type="number" value={form.labour_cost}
                                                                        onChange={handleChange} placeholder="0" />
                                                        </div>
                                                        <div className="form-group">
                                                                <label>Material Cost</label>
                                                                <input name="material_cost" type="number" value={form.material_cost}
                                                                        onChange={handleChange} placeholder="0" />
                                                        </div>
                                                </div>

                                                <div className="form-row">
                                                        <div className="form-group">
                                                                <label>Equipment Rent</label>
                                                                <input name="equipment_rent" type="number" value={form.equipment_rent}
                                                                        onChange={handleChange} placeholder="0" />
                                                        </div>
                                                        <div className="form-group">
                                                                <label>Subcontractor Cost</label>
                                                                <input name="subcontractor_cost" type="number" value={form.subcontractor_cost}
                                                                        onChange={handleChange} placeholder="0" />
                                                        </div>
                                                </div>

                                                {formError && <p className="error">{formError}</p>}
                                                <button type="submit" disabled={formLoading}>
                                                        {formLoading ? "Creating..." : "Create Project"}
                                                </button>

                                        </form>
                                </div>
                        )}

                        <div className="table-card">
                                <h3 className="table-title">All Projects</h3>
                                {projects.length === 0 ? (
                                        <p className="empty">No projects found.</p>
                                ) : (
                                        <table className="table">
                                                <thead>
                                                        <tr>
                                                                <th>#</th>
                                                                <th>Project Name</th>
                                                                <th>Client</th>
                                                                <th>Manager</th>
                                                                <th>Status</th>
                                                                <th>Start Date</th>
                                                                <th>Update Status</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        {projects.map((p, i) => (
                                                                <tr key={p.id}>
                                                                        <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                                                                        <td
                                                                                style={{ fontWeight: 500, color: "#0a7073", cursor: "pointer" }}
                                                                                onClick={() => navigate(`/projects/${p.id}`)}
                                                                        >
                                                                                {p.project_name}
                                                                        </td>
                                                                        <td>{p.client_name ?? "—"}</td>
                                                                        <td>{p.manager_name ?? "—"}</td>
                                                                        <td><StatusBadge status={p.status} /></td>
                                                                        <td>{p.start_date?.slice(0, 10)}</td>
                                                                        <td>
                                                                                <select
                                                                                        value={p.status}
                                                                                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                                                        className="status-select"
                                                                                >
                                                                                        {STATUS_OPTIONS.map((s) => (
                                                                                                <option key={s} value={s}>{s}</option>
                                                                                        ))}
                                                                                </select>
                                                                        </td>
                                                                </tr>
                                                        ))}
                                                </tbody>
                                        </table>
                                )}
                        </div>

                </div>
        );
}