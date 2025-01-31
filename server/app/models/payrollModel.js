const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");

const Payroll = sequelize.define(
  "Payroll",
  {
    payroll_id: {
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
    basic_salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deductions: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    net_salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
    payment_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "payrolls",
    timestamps: true,
  }
);

module.exports = Payroll;
