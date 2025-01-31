const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");

const Client = sequelize.define(
  "Client",
  {
    client_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinator_name: {
      type: DataTypes.STRING,
    },
    coordinator_phone: {
      type: DataTypes.STRING,
    },
    gst_number: {
      type: DataTypes.STRING,
    },
    purchased_products: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    user_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panel_name: {
      type: DataTypes.STRING,
    },
    service_type: {
      type: DataTypes.ENUM("GST", "Non-GST"),
      allowNull: false,
    },
    recharge_date: {
      type: DataTypes.DATE,
    },
    validity_expire_date: {
      type: DataTypes.DATE,
    },
    last_recharge_date: {
      type: DataTypes.DATE,
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
