const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const Employee = require("../models/employeeModel");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const { query } = require("express");

// only admin or hr can create employees
exports.createEmployee = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);
    // Debugging: Check if files are received
    const fileUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];
    console.log("Stored File Paths:", fileUrls);

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
      reference_contacts: reference_contacts
        ? JSON.parse(reference_contacts)
        : [],
      attachments: fileUrls.length ? fileUrls : [],
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

exports.searchEmployee = async (req, res) => {
  console.log(req.query);
  const { search } = req.query;
  console.log(search);

  console.log("Search Query:", search);

  if (!search) {
    return res
      .status(400)
      .json({ success: false, message: "Search query cannot be empty" });
  }

  try {
    const employees = await Employee.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
      logging: console.log,
    });

    res.json({
      success: true,
      employees: employees,
      message: "Retrieved Matching Employee List",
    });
  } catch (error) {
    console.error("Error searching employee:", error);
    res
      .status(500)
      .json({ success: false, message: "Error searching employee" });
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
