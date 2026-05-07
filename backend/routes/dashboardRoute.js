const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboard,
  tasksPerUser
} = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);
router.get("/tasks-per-user", protect, tasksPerUser);

module.exports = router;