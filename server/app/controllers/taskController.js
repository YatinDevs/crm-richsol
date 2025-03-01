const Task = require("../models/taskmodal");
const TaskHistory = require("../models/taskhistory");
const TaskNotification = require("../models/tasknotification");
const Employee = require("../models/employeeModel");

// ✅ Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assigned_to, assigned_by, priority, due_date } =
      req.body;
    console.log("1", req.body);
    const task = await Task.create({
      title,
      description,
      assigned_to,
      assigned_by,
      priority,
      due_date,
    });
    console.log("2");
    // Fetch assigned employee
    const employee = await Employee.findByPk(assigned_to);
    if (!employee) {
      return res.status(404).json({ message: "Assigned employee not found" });
    }

    // Log task creation in history
    await TaskHistory.create({
      employee_id: employee.id,
      task_id: task.id,
      changed_by: req.employee.id,
      old_status: null,
      new_status: "pending",
    });
    console.log();
    // Notify employee about the new task
    await TaskNotification.create({
      employee_id: assigned_to,
      task_id: task.id,
      message: `New task assigned: ${title}`,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    console.log(req.employee);
    const tasks = await Task.findAll();
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    console.log("1", req.body);
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);
    console.log("2", req.body);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    console.log("3", req.body);
    const oldStatus = task.status;
    task.status = status;
    await task.save();
    console.log("4", req.body);
    // Log status change in history
    console.log("5", req.employee);
    await TaskHistory.create({
      task_id: task.id,
      changed_by: req.employee.id,
      old_status: oldStatus,
      new_status: status,
    });
    console.log("5", req.body);
    // Notify employee about the status change
    await TaskNotification.create({
      employee_id: task.assigned_to,
      task_id: task.id,
      message: `Task "${task.title}" status changed to ${status}`,
    });

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    await task.destroy();
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
