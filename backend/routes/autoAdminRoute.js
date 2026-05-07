const express = require("express");
const router = express.Router();
const { createProject, addMember, removeMember, getProjects, getProjectById, deleteProject } = require("../controllers/autoAdmin.js");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createProject);
router.post("/add-member", protect, addMember);
router.post("/remove-member", protect, removeMember);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.delete("/:id", protect, deleteProject);

module.exports = router;
