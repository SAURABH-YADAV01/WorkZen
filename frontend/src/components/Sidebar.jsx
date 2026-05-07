import React from "react";
import { FolderKanban, Layers3, Plus, Trash2 } from "lucide-react";

function Sidebar({
  auth,
  projects,
  selectedProjectId,
  projectForm,
  onCreateProject,
  onDeleteProject,
  onProjectFormChange,
  onSelectProject
}) {
  return (
    <aside className="sidebar">
      <div className="brand"><FolderKanban size={22} /> WorkZen</div>

      <div className="nav-card">
        <span>Workspace</span>
        <strong>{auth.name}</strong>
        <small>{projects.length} project{projects.length === 1 ? "" : "s"}</small>
      </div>

      <form className="project-form" onSubmit={onCreateProject}>
        <div className="sidebar-title">
          <span>New project</span>
          <Plus size={16} />
        </div>
        <input placeholder="New project" value={projectForm.title} onChange={event => onProjectFormChange({ ...projectForm, title: event.target.value })} />
        <textarea placeholder="Short description" value={projectForm.description} onChange={event => onProjectFormChange({ ...projectForm, description: event.target.value })} />
        <button className="primary"><Plus size={16} /> Create</button>
      </form>

      <nav className="project-list">
        <div className="sidebar-title">
          <span>Projects</span>
          <Layers3 size={16} />
        </div>
        {!projects.length && (
          <div className="empty-card">
            <strong>No projects yet</strong>
            <small>Create a project to start assigning work.</small>
          </div>
        )}
        {projects.map(project => {
          const isAdmin = project.createdBy?._id === auth._id || project.createdBy === auth._id;

          return (
            <div key={project._id} className={`project-item ${project._id === selectedProjectId ? "selected" : ""}`}>
              <button onClick={() => onSelectProject(project._id)}>
                <span>{project.title}</span>
                <small>{project.teamMembers?.length || 0} members</small>
              </button>
              {isAdmin && (
                <button className="project-delete" title="Delete project" onClick={() => onDeleteProject(project._id)}>
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
