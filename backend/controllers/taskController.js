const Task = require("../model/Task");
const Project = require("../model/Project");
const { isValidDate, isValidObjectId } = require("../utils/validators.js");

const validStatuses = ["To Do", "In Progress", "Done"];
const validPriorities = ["Low", "Medium", "High"];

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, priority } = req.body;

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({ message: "Title, projectId and assignedTo are required" });
    }

    if (!title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    if (!isValidObjectId(projectId) || !isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: "Invalid projectId or assignedTo" });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    if (!isValidDate(dueDate)) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only project admin can create task
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    const isProjectMember = project.teamMembers.some(
      member => member.toString() === assignedTo
    );

    if (!isProjectMember) {
      return res.status(400).json({ message: "Assigned user must be a project member" });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      project: projectId,
      assignedTo,
      dueDate,
      priority
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = {};

    if (projectId) {
      if (!isValidObjectId(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const isAdmin = project.createdBy.toString() === req.user._id.toString();
      const isMember = project.teamMembers.some(
        member => member.toString() === req.user._id.toString()
      );

      if (!isAdmin && !isMember) {
        return res.status(403).json({ message: "Not allowed to view this project's tasks" });
      }

      filter.project = projectId;

      if (!isAdmin) {
        filter.assignedTo = req.user._id;
      }
    } else {
      const adminProjects = await Project.find({ createdBy: req.user._id }).select("_id");
      const adminProjectIds = adminProjects.map(project => project._id);

      filter.$or = [
        { assignedTo: req.user._id },
        { project: { $in: adminProjectIds } }
      ];
    }

    const tasks = await Task.find(filter)
      .populate("project", "title")
      .populate("assignedTo", "name email");

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id)
      .populate("project", "title createdBy teamMembers")
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssignedUser = task.assignedTo._id.toString() === req.user._id.toString();
    const isProjectAdmin = task.project.createdBy.toString() === req.user._id.toString();

    if (!isAssignedUser && !isProjectAdmin) {
      return res.status(403).json({ message: "Not allowed to view this task" });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAssignedUser = task.assignedTo.toString() === req.user._id.toString();
    const isProjectAdmin = project.createdBy.toString() === req.user._id.toString();

    // Assigned members can update their own status; project admin can manage tasks too.
    if (!isAssignedUser && !isProjectAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = status;
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!isValidDate(dueDate)) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    if (assignedTo && !isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: "Invalid assignedTo" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isProjectAdmin = project.createdBy.toString() === req.user._id.toString();

    if (!isProjectAdmin) {
      return res.status(403).json({ message: "Only project admin can update task details" });
    }

    if (assignedTo) {
      const isProjectMember = project.teamMembers.some(
        member => member.toString() === assignedTo
      );

      if (!isProjectMember) {
        return res.status(400).json({ message: "Assigned user must be a project member" });
      }

      task.assignedTo = assignedTo;
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project admin can delete tasks" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
