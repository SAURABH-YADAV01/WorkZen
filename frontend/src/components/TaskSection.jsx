import React from "react";
import TaskBoard from "./TaskBoard.jsx";
import TaskForm from "./TaskForm.jsx";

function TaskSection({
  editingTaskId,
  isProjectAdmin,
  loading,
  selectedProject,
  taskForm,
  taskGroups,
  tasksCount,
  onCancelEdit,
  onDeleteTask,
  onEditTask,
  onSaveTask,
  onTaskFormChange,
  onUpdateStatus
}) {
  return (
    <section className={`task-area ${loading ? "is-loading" : ""}`}>
      <div className="section-head">
        <div>
          <h2>Task board</h2>
          <p>{loading ? "Loading..." : `${tasksCount} visible tasks`}</p>
        </div>
      </div>

      <div className="task-composer">
        {isProjectAdmin ? (
          <TaskForm
            editingTaskId={editingTaskId}
            selectedProject={selectedProject}
            taskForm={taskForm}
            onCancel={onCancelEdit}
            onChange={onTaskFormChange}
            onSubmit={onSaveTask}
          />
        ) : (
          <div className="empty-card">
            <strong>Read-only project</strong>
            <small>Only project admins can create or edit tasks.</small>
          </div>
        )}
      </div>

      <TaskBoard
        isProjectAdmin={isProjectAdmin}
        taskGroups={taskGroups}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        onUpdateStatus={onUpdateStatus}
      />
    </section>
  );
}

export default TaskSection;
