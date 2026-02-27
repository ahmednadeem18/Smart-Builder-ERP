import { useEffect, useState } from "react";
import { GetProjects } from "../services/project.services.js";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetProjects()
      .then(data => {
        // here backend returns { success: true, data: [ ... ] }
        if (Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          setProjects([]);
          setError("Unexpected API response structure");
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load projects");
      });
  }, []);

  return (
    <div>
      <h2>All Projects</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {projects.length === 0 && !error && <p>Loading projects...</p>}

      {projects.map(project => (
        <div key={project.id} style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
          <p><strong>ID:</strong> {project.id}</p>
          <p><strong>Name:</strong> {project.project_name}</p>
          <p><strong>Status:</strong> {project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Projects;