const Project = require("../models/Project");
const User = require("../models/User");



// CREATE PROJECT
const createProject = async (req, res) => {
  try {

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// GET PROJECTS
const getProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    res.status(200).json({
      success: true,
      projects,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ADD MEMBER
const addMember = async (req, res) => {
  try {

    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // check user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // avoid duplicate members
    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already member of project",
      });
    }

    project.members.push(userId);

    await project.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      project,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// DELETE PROJECT
const deleteProject = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  createProject,
  getProjects,
  addMember,
  deleteProject,
};