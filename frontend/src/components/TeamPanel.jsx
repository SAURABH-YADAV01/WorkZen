import React from "react";
import { Search, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";

function TeamPanel({
  auth,
  isProjectAdmin,
  search,
  selectedProject,
  tasksPerUser,
  users,
  onAddMember,
  onRemoveMember,
  onSearchChange
}) {
  const availableUsers = users.filter(user => (
    !selectedProject?.teamMembers?.some(member => member._id === user._id)
  ));

  return (
    <aside className="people-panel">
      <div className="section-head">
        <div>
          <h2>Team</h2>
          <p>{isProjectAdmin ? "Manage members" : "Project members"}</p>
        </div>
        <Users size={20} />
      </div>

      <div className="member-list">
        {selectedProject?.teamMembers?.length ? selectedProject.teamMembers.map(member => (
          <div className="member-row" key={member._id}>
            <span>
              {member.name}
              <small>{member.email}</small>
            </span>
            {isProjectAdmin && member._id !== auth._id && (
              <button className="icon-button danger" title="Remove member" onClick={() => onRemoveMember(member._id)}><Trash2 size={16} /></button>
            )}
          </div>
        )) : (
          <div className="empty-card">
            <strong>No members yet</strong>
            <small>Add people after creating a project.</small>
          </div>
        )}
      </div>

      {isProjectAdmin && (
        <div className="search-box">
          <div className="panel-label"><ShieldCheck size={15} /> Add teammate</div>
          <label>
            <Search size={16} />
            <input placeholder="Search users" value={search} onChange={event => onSearchChange(event.target.value)} />
          </label>
          {availableUsers.length ? availableUsers.map(user => (
            <button className="user-result" key={user._id} onClick={() => onAddMember(user._id)}>
              <span>{user.name}<small>{user.email}</small></span>
              <UserPlus size={16} />
            </button>
          )) : (
            <div className="empty-card compact-empty">
              <small>No users available for this search.</small>
            </div>
          )}
        </div>
      )}

      {isProjectAdmin && tasksPerUser.length > 0 && (
        <div className="user-stats">
          <h3>Tasks per user</h3>
          {tasksPerUser.map(row => (
            <div key={row.userId} className="mini-stat">
              <span>{row.name}</span>
              <strong>{row.totalTasks}</strong>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

export default TeamPanel;
