const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const Employee = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

// only admin or hr can create employees
exports.createEmployee = async (req, res) => {
  try {
    console.log(req.body);

    const {
      username,
      email,
      password,
      role,
      phone,
      alternate_phone,
      designation,
      department,
      dob,
      joining_date,
      probation_end_date,
      training_end_date,
      increment_date,
      anniversary_date,
      address,
      blood_group,
      reference_contacts,
      attachments,
    } = req.body;
    console.log(username, email, password, role);
    console.log(req.files);
    const fileUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];
    console.log(fileUrls);
    const exisitingEmployee = await Employee.findOne({ where: { email } });
    if (exisitingEmployee) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Retrieve uploaded file paths

    const employee = await Employee.create({
      username,
      email,
      password: hashedPassword,
      role: role,
      phone,
      alternate_phone,
      designation,
      department,
      dob,
      joining_date,
      probation_end_date,
      training_end_date,
      increment_date,
      anniversary_date,
      address,
      blood_group,
      reference_contacts: JSON.parse(reference_contacts || "[]"), // Ensure it's stored as JSON
      attachments: fileUrls, // Store file URLs
    });
    // Exclude password from the response
    const { password: _, ...employeeDetails } = employee.toJSON();

    res.status(201).json({
      message: "Employee Onboarded successfully!",
      employeeDetails: employeeDetails,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Employee Onboarded failed!",
      success: false,
    });
  }
};
// Get all employees (excluding password)
exports.getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const sanitizedEmployees = employees.map((emp) => {
      const { password: _, ...employeeDetails } = emp.toJSON();
      return employeeDetails;
    });

    res.status(200).json({
      message: "Employee listing retrieved successfully!",
      employeeDetails: sanitizedEmployees,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Failed to retrieve employee listing!",
      success: false,
    });
  }
};

// Deactivate employee
exports.deactivateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await employee.update({ status: "inactive" });
    const { password: _, ...employeeDetails } = employee.toJSON();

    res.status(200).json({
      message: "Employee deactivated successfully!",
      employeeDetails,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await employee.update(req.body);
    const { password: _, ...employeeDetails } = employee.toJSON();

    res.status(200).json({
      message: "Employee updated successfully!",
      employeeDetails,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get employee by ID (excluding password)
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { password: _, ...employeeDetails } = employee.toJSON();
    res.status(200).json({
      message: "Employee retrieved successfully!",
      employeeDetails,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get tasks assigned to an employee
exports.getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { assigned_to: req.params.id } });
    res.status(200).json({
      message: "Employee tasks retrieved successfully!",
      tasks,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get attendance records for an employee
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      where: { employee_id: req.params.id },
    });
    res.status(200).json({
      message: "Employee attendance retrieved successfully!",
      attendance,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get leave requests for an employee
exports.getEmployeeLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.findAll({
      where: { employee_id: req.params.id },
    });
    res.status(200).json({
      message: "Employee leave requests retrieved successfully!",
      leaveRequests,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
