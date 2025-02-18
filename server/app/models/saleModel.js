const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");
const Client = require("./clientModel");
const Service = require("./serviceModel");

const Sale = sequelize.define(
  "Sale",
  {
    sale_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    for_client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    by_employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    for_service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT, // sales step 3
      allowNull: false,
    },
    gst_value: {
      type: DataTypes.FLOAT, // sales step 3
    },
    total_amount: {
      type: DataTypes.FLOAT, // sales step 3
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "partial"),
      defaultValue: "pending",
    },
    sale_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    sale_by: { type: DataTypes.INTEGER, allowNull: false },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "sales",
    timestamps: true,
  }
);

module.exports = Sale;
