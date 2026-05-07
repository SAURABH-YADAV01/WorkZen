import React, { useEffect, useMemo, useState } from "react";
import AuthScreen from "./components/AuthScreen.jsx";
import DashboardStats from "./components/DashboardStats.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TaskSection from "./components/TaskSection.jsx";
import TeamPanel from "./components/TeamPanel.jsx";
import Topbar from "./components/Topbar.jsx";
import { apiRequest } from "./lib/api.js";
import { emptyAuthForm, emptyProjectForm, emptyTaskForm, STATUSES } from "./lib/constants.js";

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("ttm_auth");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [tasksPerUser, setTasksPerUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [taskForm, setTaskForm] = useState(emptyTaskForm); 
  const [editingTaskId, setEditingTaskId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = auth?.token;
  const selectedProject = projects.find(project => project._id === selectedProjectId);
  const isProjectAdmin = selectedProject?.createdBy?._id === auth?._id || selectedProject?.createdBy === auth?._id;

  const taskGroups = useMemo(() => {
    return STATUSES.reduce((groups, status) => {
      groups[status] = tasks.filter(task => task.status === status);
      return groups;
    }, {});
  }, [tasks]);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2800);
  };

  const request = (path, options = {}) => apiRequest(path, { ...options, token });

  const loadProjects = async () => {
    const data = await request("/projects");
    setProjects(data);
    if (!selectedProjectId && data.length) {
      setSelectedProjectId(data[0]._id);
    }
  };

  const loadWorkspace = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const projectData = await request("/projects");
      setProjects(projectData);

      const activeProjectId = selectedProjectId || projectData[0]?._id || "";
      if (activeProjectId && !selectedProjectId) {
        setSelectedProjectId(activeProjectId);
      }

      const taskPath = activeProjectId ? `/tasks?projectId=${activeProjectId}` : "/tasks";
      const dashboardPath = activeProjectId ? `/dashboard?projectId=${activeProjectId}` : "/dashboard";
      const [taskData, dashboardData] = await Promise.all([
        request(taskPath),
        request(dashboardPath)
      ]);

      setTasks(taskData);
      setDashboard(dashboardData);
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [token, selectedProjectId]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) return;

      try {
        const data = await request(`/auth/users?search=${encodeURIComponent(search)}`);
        setUsers(data);
      } catch (error) {
        showMessage(error.message);
      }
    };

    loadUsers();
  }, [token, search]);

  useEffect(() => {
    const loadTasksPerUser = async () => {
      if (!selectedProjectId || !isProjectAdmin) {
        setTasksPerUser([]);
        return;
      }

      try {
        const data = await request(`/dashboard/tasks-per-user?projectId=${selectedProjectId}`);
        setTasksPerUser(data);
      } catch {
        setTasksPerUser([]);
      }
    };

    loadTasksPerUser();
  }, [selectedProjectId, isProjectAdmin, tasks.length]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const path = authMode === "login" ? "/auth/login" : "/auth/signup";
      const payload = authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : authForm;
      const data = await apiRequest(path, { method: "POST", body: payload });

      localStorage.setItem("ttm_auth", JSON.stringify(data));
      setAuth(data);
      setAuthForm(emptyAuthForm);
      showMessage(authMode === "login" ? "Logged in successfully" : "Account created");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ttm_auth");
    setAuth(null);
    setProjects([]);
    setTasks([]);
    setSelectedProjectId("");
  };

  const createProject = async (event) => {
    event.preventDefault();

    try {
      await request("/projects", { method: "POST", body: projectForm });
      setProjectForm(emptyProjectForm);
      showMessage("Project created");
      await loadProjects();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await request(`/projects/${projectId}`, { method: "DELETE" });
      const remainingProjects = projects.filter(project => project._id !== projectId);
      setSelectedProjectId(remainingProjects[0]?._id || "");
      showMessage("Project deleted");
      await loadProjects();

      if (!remainingProjects.length) {
        setTasks([]);
        setDashboard(null);
      }
    } catch (error) {
      showMessage(error.message);
    }
  };

  const addMember = async (userId) => {
    if (!selectedProjectId) return;

    try {
      await request("/projects/add-member", {
        method: "POST",
        body: { projectId: selectedProjectId, userId }
      });
      showMessage("Member added");
      await loadWorkspace();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const removeMember = async (userId) => {
    try {
      await request("/projects/remove-member", {
        method: "POST",
        body: { projectId: selectedProjectId, userId }
      });
      showMessage("Member removed");
      await loadWorkspace();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const saveTask = async (event) => {
    event.preventDefault();

    if (!selectedProjectId) {
      showMessage("Create or select a project first");
      return;
    }

    try {
      if (editingTaskId) {
        await request(`/tasks/${editingTaskId}`, {
          method: "PUT",
          body: taskForm
        });
        showMessage("Task updated");
      } else {
        await request("/tasks", {
          method: "POST",
          body: { ...taskForm, projectId: selectedProjectId }
        });
        showMessage("Task created");
      }

      setTaskForm(emptyTaskForm);
      setEditingTaskId("");
      await loadWorkspace();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const editTask = (task) => {
    setEditingTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo?._id || task.assignedTo,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: task.priority
    });
  };

  const cancelTaskEdit = () => {
    setEditingTaskId("");
    setTaskForm(emptyTaskForm);
  };

  const updateStatus = async (taskId, status) => {
    try {
      await request(`/tasks/${taskId}/status`, {
        method: "PATCH",
        body: { status }
      });
      await loadWorkspace();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await request(`/tasks/${taskId}`, { method: "DELETE" });
      showMessage("Task deleted");
      await loadWorkspace();
    } catch (error) {
      showMessage(error.message);
    }
  };

  if (!auth) {
    return (
      <AuthScreen
        authMode={authMode}
        authForm={authForm}
        loading={loading}
        message={message}
        onAuthModeChange={setAuthMode}
        onAuthFormChange={setAuthForm}
        onSubmit={handleAuth}
      />
    );
  }

  return (
    <main className="app-shell">
      <Sidebar
        auth={auth}
        projects={projects}
        selectedProjectId={selectedProjectId}
        projectForm={projectForm}
        onCreateProject={createProject}
        onDeleteProject={deleteProject}
        onProjectFormChange={setProjectForm}
        onSelectProject={setSelectedProjectId}
      />

      <section className="workspace-shell">
        <Topbar auth={auth} selectedProject={selectedProject} onLogout={logout} />
        {message && <p className="toast">{message}</p>}

        <section className="workspace">
          <DashboardStats dashboard={dashboard} />

          <section className="content-grid">
            <TaskSection
              editingTaskId={editingTaskId}
              isProjectAdmin={isProjectAdmin}
              loading={loading}
              selectedProject={selectedProject}
              taskForm={taskForm}
              taskGroups={taskGroups}
              tasksCount={tasks.length}
              onCancelEdit={cancelTaskEdit}
              onDeleteTask={deleteTask}
              onEditTask={editTask}
              onSaveTask={saveTask}
              onTaskFormChange={setTaskForm}
              onUpdateStatus={updateStatus}
            />

            <TeamPanel
              auth={auth}
              isProjectAdmin={isProjectAdmin}
              search={search}
              selectedProject={selectedProject}
              tasksPerUser={tasksPerUser}
              users={users}
              onAddMember={addMember}
              onRemoveMember={removeMember}
              onSearchChange={setSearch}
            />
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;
