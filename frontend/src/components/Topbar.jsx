import React from "react";
import { CalendarDays, LogOut, Users } from "lucide-react";

function Topbar({ auth, selectedProject, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Project workspace</p>
        <h1>{selectedProject?.title || "Create your first project"}</h1>
        <p className="topbar-subtitle">{selectedProject?.description || "Create a project, invite your team, and start tracking tasks."}</p>
      </div>
      <div className="topbar-actions">
        <span className="pill"><Users size={15} /> {selectedProject?.teamMembers?.length || 0} members</span>
        <span className="pill"><CalendarDays size={15} /> Today</span>
        <div className="account">
          <span>{auth.name}</span>
          <button className="icon-button" title="Logout" onClick={onLogout}><LogOut size={18} /></button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
