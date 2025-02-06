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

    // 🔹 Store Refresh Token in HTTP-only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access (security)
      secure: process.env.NODE_ENV === "production", // Use only in HTTPS
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 🔹 Store Access Token in Secure Cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // More secure, but frontend can't access it
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    const { password: _, ...employeeDetails } = employee.toJSON();

    res.cookie("employeeData", JSON.stringify(employeeDetails), {
      httpOnly: false, // Allow frontend access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({
      message: "User created and logged in successfully",
      accessToken: accessToken,
      employeeDetails: employeeDetails,
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

    // Clear cookies for both refreshToken & accessToken
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("accessToken", {
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
    if (!employee) {
      return res.status(401).json({ error: "Employee not found" });
    }

    const newAccessToken = generateAccessToken(employee);
    const newRefreshToken = generateRefreshToken(employee);

    // Remove old refresh token and create a new one
    await Token.destroy({ where: { token: refreshToken } });
    await Token.create({
      employeeId: employee.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // Include new refresh token in response
      employeeDetails: employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
