import React from "react";
import { CalendarDays, Pencil, Trash2, UserRound } from "lucide-react";
import { STATUSES } from "../lib/constants.js";

function TaskBoard({
  isProjectAdmin,
  taskGroups,
  onDeleteTask,
  onEditTask,
  onUpdateStatus
}) {
  return (
    <div className="board">
      {STATUSES.map(status => (
        <section className="column" key={status}>
          <div className="column-head">
            <h3>{status}</h3>
            <span>{taskGroups[status]?.length || 0}</span>
          </div>
          <div className="task-stack">
            {taskGroups[status]?.length ? taskGroups[status].map(task => (
              <TaskCard
                key={task._id}
                isProjectAdmin={isProjectAdmin}
                task={task}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                onUpdateStatus={onUpdateStatus}
              />
            )) : (
              <div className="empty-card column-empty">
                <strong>No tasks</strong>
                <small>Items in this stage will appear here.</small>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function TaskCard({ isProjectAdmin, task, onDeleteTask, onEditTask, onUpdateStatus }) {
  return (
    <article className="task-card">
      <div className="task-title">
        <strong>{task.title}</strong>
        <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>

      {task.description && <p>{task.description}</p>}

      <div className="task-meta">
        <span><UserRound size={14} /> {task.assignedTo?.name || "Unassigned"}</span>
        <span><CalendarDays size={14} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
      </div>

      <div className="task-actions">
        <select value={task.status} onChange={event => onUpdateStatus(task._id, event.target.value)}>
          {STATUSES.map(option => <option key={option}>{option}</option>)}
        </select>
        {isProjectAdmin && (
          <>
            <button className="ghost" onClick={() => onEditTask(task)}><Pencil size={14} /> Edit</button>
            <button className="icon-button danger" title="Delete task" onClick={() => onDeleteTask(task._id)}><Trash2 size={16} /></button>
          </>
        )}
      </div>
    </article>
  );
}

export default TaskBoard;
