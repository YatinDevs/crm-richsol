const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const Employee = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

// User Signup flow
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    const exisitingEmployee = await Employee.findOne({ where: { email } });
    if (exisitingEmployee) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log(req.body);
    const accessToken = generateAccessToken(employee);
    const refreshToken = generateRefreshToken(employee);

    await Token.create({
      employeeId: employee.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    console.log(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(accessToken);

    res.status(201).json({
      message: "User created and logged in successfully",
      accessToken: accessToken,
      employeeDetails: employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login flow
exports.login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    const employee = await Employee.findOne({ where: { email } });
    console.log(employee);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    console.log(password);
    console.log(employee.password);

    const isPasswordValid = await bcrypt.compare(
      password,
      employee?.dataValues?.password
    );
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password." });
    }
    const accessToken = generateAccessToken(employee);
    const refreshToken = generateRefreshToken(employee);

    console.log(accessToken, `access`);
    console.log(refreshToken, `refresh`);

    await Token.create({
      employeeId: employee.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(refreshToken);

    console.log(accessToken);
    const { password: _, ...empwithoutPass } = employee.toJSON();
    res.status(201).json({
      message: "User created and logged in successfully",
      accessToken: accessToken,
      employeeDetails: empwithoutPass,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    const tokenData = await Token.findOne({ where: { token: refreshToken } });
    if (!tokenData) {
      return res.status(400).json({ error: "Invalid refresh token" });
    }

    await Token.destroy({ where: { token: refreshToken } });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshTokenAction = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const tokenData = await Token.findOne({ where: { token: refreshToken } });
    if (!tokenData || tokenData.expiresAt < new Date()) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    const employee = await Employee.findByPk(tokenData.employeeId);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await Token.destroy({ where: { token: refreshToken } });
    await Token.create({
      employeeId: employee.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      employeeDetails: employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
