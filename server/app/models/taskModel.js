const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");
const Client = require("./clientModel");
const Service = require("./serviceModel");

const Task = sequelize.define(
  "Task",
  {
    task_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    assigned_to: {
      type: DataTypes.INTEGER,

      allowNull: false,
    },
    assigned_by: {
      type: DataTypes.INTEGER,

      allowNull: false,
    },
    for_client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    for_service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High", "Critical"),
      defaultValue: "Medium",
    },
    status: {
      type: DataTypes.ENUM("Pending", "In Progress", "Completed", "On Hold"),
      defaultValue: "Pending",
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completed_at: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tasks",
    // timestamps: true,
  }
);

module.exports = Task;
