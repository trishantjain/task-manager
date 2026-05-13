const Task = require("../models/Task");
const Project = require("../models/Project");



// CREATE TASK
const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    // validations
    if (!title || !project || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // check project exists
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ensure assigned user is project member
    if (!existingProject.members.includes(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "User is not member of this project",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// GET TASKS
const getTasks = async (req, res) => {
  try {

    let tasks;

    // admin gets all tasks
    if (req.user.role === "admin") {

      tasks = await Task.find()
        .populate("project", "name")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name");

    } else {

      // member gets assigned tasks only
      tasks = await Task.find({
        assignedTo: req.user._id,
      })
        .populate("project", "name")
        .populate("assignedTo", "name email")
        .populate("createdBy", "name");

    }

    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // member can only update own task
    if (
      req.user.role === "member" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {

      return res.status(403).json({
        success: false,
        message: "You can update only your tasks",
      });

    }

    task.status = status;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated",
      task,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
};