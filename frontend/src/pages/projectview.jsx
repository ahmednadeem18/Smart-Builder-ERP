import { useEffect, useState } from "react";
import { GetProjects } from "../services/project.services.js";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    GetProjects()
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>All Projects</h2>

      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.project_name}</h3>
          <p>Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Projects;