const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");
const Client = require("./clientModel");
const Service = require("./serviceModel");

const Task = sequelize.define(
  "Task",
  {
    task_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      references: {
        model: Employee,
        key: "id",
      },
      allowNull: false,
    },
    assigned_by: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
      allowNull: false,
    },
    client_id: {
      type: DataTypes.UUID,
      references: {
        model: Client,
        key: "client_id",
      },
      allowNull: false,
    },
    service_id: {
      type: DataTypes.UUID,
      references: {
        model: Service,
        key: "service_id",
      },
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
    timestamps: true,
  }
);

module.exports = Task;
