const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");
const Employee = require("./employeeModel");

const Client = sequelize.define(
  "Client",
  {
    // Personal Info
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      // client Onboarding details step 1
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_name: {
      // client Onboarding details step 1
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_phone: {
      // client Onboarding details step 1
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      // client Onboarding details step 1
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // BusinessDetails
    service_type: {
      type: DataTypes.ENUM("GST", "Non-GST"),
      allowNull: false, // sales step 2
    },
    gst_number: {
      // client Onboarding details step 1
      type: DataTypes.STRING,
    },
    coordinator_name: {
      // client Onboarding details step 1
      type: DataTypes.STRING,
    },
    coordinator_phone: {
      // client Onboarding details step 1
      type: DataTypes.STRING,
    },
    panel_name: {
      type: DataTypes.STRING,
    },
    purchased_products: {
      // client Onboarding details step 1
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    // Client Credentials
    email: {
      // sales step 1
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priority_level: {
      type: DataTypes.ENUM("Normal", "High", "Critical"),
      defaultValue: "Normal",
    },
    notes: {
      type: DataTypes.TEXT,
    },

    onboarded_by: {
      // client Onboarding details step 1
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
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
