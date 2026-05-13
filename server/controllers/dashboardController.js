const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {

    let filter = {};

    // member sees only assigned tasks
    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    // total tasks
    const totalTasks = await Task.countDocuments(filter);

    // completed tasks
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Done",
    });

    // pending tasks
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: {
        $ne: "Done",
      },
    });

    // overdue tasks
    const overdueTasks = await Task.countDocuments({
      ...filter,
      dueDate: {
        $lt: new Date(),
      },
      status: {
        $ne: "Done",
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getDashboardStats,
};