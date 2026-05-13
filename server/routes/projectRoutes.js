const express = require("express");

const {
  createProject,
  getProjects,
  addMember,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE PROJECT
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createProject
);


// GET PROJECTS
router.get(
  "/",
  protect,
  getProjects
);


// ADD MEMBER
router.put(
  "/:id/members",
  protect,
  authorizeRoles("admin"),
  addMember
);

module.exports = router;