const Task = require("../model/Task");
const Project = require("../model/Project");
const { isValidObjectId } = require("../utils/validators.js");

// Dashboard summary
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
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

      const isAdmin = project.createdBy.toString() === userId.toString();
      const isMember = project.teamMembers.some(
        member => member.toString() === userId.toString()
      );

      if (!isAdmin && !isMember) {
        return res.status(403).json({ message: "Not allowed to view this dashboard" });
      }

      filter.project = projectId;

      if (!isAdmin) {
        filter.assignedTo = userId;
      }
    } else {
      filter.assignedTo = userId;
    }

    // total tasks
    const totalTasks = await Task.countDocuments(filter);

    // tasks by status
    const completed = await Task.countDocuments({
      ...filter,
      status: "Done"
    });

    const inProgress = await Task.countDocuments({
      ...filter,
      status: "In Progress"
    });

    const todo = await Task.countDocuments({
      ...filter,
      status: "To Do"
    });

    // overdue tasks
    const overdue = await Task.countDocuments({
      ...filter,
      dueDate: { $lt: new Date() },
      status: { $ne: "Done" }
    });

    res.json({
      totalTasks,
      completed,
      inProgress,
      todo,
      overdue
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.tasksPerUser = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only project admin can view tasks per user" });
    }

    const data = await Task.aggregate([
      {
        $match: {
          project: project._id
        }
      },
      {
        $group: {
          _id: "$assignedTo",
          totalTasks: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",
          totalTasks: 1
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
