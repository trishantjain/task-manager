const express = require("express");

const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE TASK
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTask
);


// GET TASKS
router.get(
  "/",
  protect,
  getTasks
);


// UPDATE TASK STATUS
router.put(
  "/:id/status",
  protect,
  updateTaskStatus
);

module.exports = router;