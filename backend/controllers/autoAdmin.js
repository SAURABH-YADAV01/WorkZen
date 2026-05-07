const Project = require("../model/Project.js");
const User = require("../model/User.js");
const Task = require("../model/Task.js");
const { isValidObjectId } = require("../utils/validators.js");


exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title: title.trim(),
      description,
      createdBy: req.user._id, // creator = admin
      teamMembers: [req.user._id] // include admin as member
    });

    res.status(201).json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!isValidObjectId(projectId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid projectId or userId" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // check admin
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyMember = project.teamMembers.some(
      member => member.toString() === userId
    );

    if (!isAlreadyMember) {
      project.teamMembers.push(userId);
      await project.save();
    }

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!isValidObjectId(projectId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid projectId or userId" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    if (project.createdBy.toString() === userId) {
      return res.status(400).json({ message: "Project admin cannot be removed" });
    }

    const openTasks = await Task.countDocuments({
      project: projectId,
      assignedTo: userId,
      status: { $ne: "Done" }
    });

    if (openTasks > 0) {
      return res.status(400).json({
        message: "Cannot remove member with open tasks. Reassign or complete their tasks first."
      });
    }

    project.teamMembers = project.teamMembers.filter(
      member => member.toString() !== userId
    );

    await project.save();

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user._id },
        { teamMembers: req.user._id }
      ]
    })
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

    res.json(projects);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id)
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAdmin = project.createdBy._id.toString() === req.user._id.toString();
    const isMember = project.teamMembers.some(
      member => member._id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "Not allowed to view this project" });
    }

    res.json(project);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project admin can delete this project" });
    }

    await Task.deleteMany({ project: id });
    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
