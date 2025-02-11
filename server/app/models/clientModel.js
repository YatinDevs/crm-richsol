const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");
const Employee = require("./employeeModel");

const Client = sequelize.define(
  "Client",
  {
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      // sales step 1
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      // sales step 1
      type: DataTypes.TEXT,
      allowNull: false,
    },
    owner_name: {
      // sales step 1
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_phone: {
      // sales
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinator_name: {
      // sales step 1
      type: DataTypes.STRING,
    },
    coordinator_phone: {
      // sales step 1
      type: DataTypes.STRING,
    },
    gst_number: {
      type: DataTypes.STRING,
    },
    purchased_products: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    onboarded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      // sales step 1
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    panel_name: {
      type: DataTypes.STRING,
    },
    service_type: {
      type: DataTypes.ENUM("GST", "Non-GST"),
      allowNull: false, // sales step 2
    },
    recharge_date: {
      type: DataTypes.DATE, // sales step 2
    },
    validity_expire_date: {
      type: DataTypes.DATE, // sales step 2
    },
    last_recharge_date: {
      type: DataTypes.DATE, // sales step 2
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    notes: {
      type: DataTypes.TEXT,
    },
    priority_level: {
      type: DataTypes.ENUM("Normal", "High", "Critical"),
      defaultValue: "Normal",
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
    tableName: "clients",
    timestamps: true,
  }
);

module.exports = Client;
