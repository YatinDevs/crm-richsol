const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");
// const Task = require("./taskModel");
// const Notification = require("./notificationModel");
// const Client = require("./clientModel");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      // Personal Details -
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      // employee Credentials -
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      // employee Credentials
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      // -
      type: DataTypes.ENUM(
        "employee",
        "admin",
        "hr",
        "accounts",
        "sales",
        "support",
        "tech"
      ),
      defaultValue: "employee",
    },

    phone: {
      // employee Details -
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: true,
    },
    alternate_phone: {
      // employee Details -
      type: DataTypes.STRING(15),
    },
    designation: {
      // Work Details -
      type: DataTypes.STRING(50),
    },
    department: {
      // Work Details -
      type: DataTypes.ENUM,
      values: [
        "Development Team",
        "HR Team",
        "Marketing Team",
        "Interns",
        "Sales Team",
        "Support Team",
      ],
    },
    dob: {
      // employee Details -
      type: DataTypes.DATE,
    },
    joining_date: {
      // Work Details -
      type: DataTypes.DATE,
    },
    probation_end_date: {
      // Work Details -
      type: DataTypes.DATE,
    },
    training_end_date: {
      // Work Details
      type: DataTypes.DATE,
    },
    increment_date: {
      // Work Details
      type: DataTypes.DATE,
    },
    anniversary_date: {
      // Personal Details
      type: DataTypes.DATE,
    },
    address: {
      // Personal Details -
      type: DataTypes.TEXT,
    },
    state: {
      type: DataTypes.STRING(50),
    },
    country: {
      type: DataTypes.STRING(50),
    },
    pincode: {
      type: DataTypes.STRING(10),
    },
    blood_group: {
      // Personal Details -
      type: DataTypes.STRING(5),
    },
    status: {
      // -
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    reference_contacts: {
      // Personal Details
      type: DataTypes.JSONB,
    },
    attachments: {
      // Personal Details
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "employees",
    timestamps: true,
  }
);

module.exports = Employee;
