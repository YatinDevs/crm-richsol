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
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
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
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: true,
    },
    alternate_phone: {
      type: DataTypes.STRING(15),
    },
    designation: {
      type: DataTypes.STRING(50),
    },
    department: {
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
      type: DataTypes.DATE,
    },
    joining_date: {
      type: DataTypes.DATE,
    },
    probation_end_date: {
      type: DataTypes.DATE,
    },
    training_end_date: {
      type: DataTypes.DATE,
    },
    increment_date: {
      type: DataTypes.DATE,
    },
    anniversary_date: {
      type: DataTypes.DATE,
    },
    address: {
      type: DataTypes.TEXT,
    },
    blood_group: {
      type: DataTypes.STRING(5),
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    reference_contacts: {
      type: DataTypes.JSONB,
    },
    attachments: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "employees",
    timestamps: true,
  }
);

module.exports = Employee;
