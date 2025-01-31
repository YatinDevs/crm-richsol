const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");

const LeaveRequest = sequelize.define(
  "LeaveRequest",
  {
    leave_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
      allowNull: false,
    },
    leave_type: {
      type: DataTypes.ENUM("sick", "casual", "earned"),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    reason: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "leave_requests",
    timestamps: true,
  }
);

module.exports = LeaveRequest;
