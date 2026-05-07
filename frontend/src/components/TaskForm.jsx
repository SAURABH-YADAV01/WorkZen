import React from "react";
import { CalendarDays, FileText, Flag, UserRound } from "lucide-react";
import { PRIORITIES } from "../lib/constants.js";

function TaskForm({
  editingTaskId,
  selectedProject,
  taskForm,
  onCancel,
  onChange,
  onSubmit
}) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <div className="form-heading compact">
        <span>{editingTaskId ? "Editing task" : "Quick add"}</span>
        <h2>{editingTaskId ? "Update task details" : "Create a new task"}</h2>
      </div>

      <label className="field wide">
        <FileText size={15} />
        <input placeholder="Task title" value={taskForm.title} onChange={event => onChange({ ...taskForm, title: event.target.value })} />
      </label>
      <label className="field wide">
        <FileText size={15} />
        <textarea placeholder="Description" value={taskForm.description} onChange={event => onChange({ ...taskForm, description: event.target.value })} />
      </label>
      <label className="field">
        <UserRound size={15} />
        <select value={taskForm.assignedTo} onChange={event => onChange({ ...taskForm, assignedTo: event.target.value })}>
          <option value="">Assign to</option>
          {selectedProject?.teamMembers?.map(member => (
            <option key={member._id} value={member._id}>{member.name}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <CalendarDays size={15} />
        <input type="date" value={taskForm.dueDate} onChange={event => onChange({ ...taskForm, dueDate: event.target.value })} />
      </label>
      <label className="field">
        <Flag size={15} />
        <select value={taskForm.priority} onChange={event => onChange({ ...taskForm, priority: event.target.value })}>
          {PRIORITIES.map(priority => <option key={priority}>{priority}</option>)}
        </select>
      </label>
      <div className="form-actions">
        <button className="primary">{editingTaskId ? "Update task" : "Add task"}</button>
        {editingTaskId && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default TaskForm;
