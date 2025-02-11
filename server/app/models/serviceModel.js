const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");

const Service = sequelize.define(
  "Service",
  {
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_name: {
      type: DataTypes.ENUM(
        "Website Development",
        "Mobile App Development",
        "Software Development",
        "Digital Marketing",
        "WhatsApp Tool Marketing",
        "Bulk SMS"
      ), // sales step 1 // list by sanika
      allowNull: false,
    },
    service_type: {
      type: DataTypes.ENUM("GST", "Non-GST"),
      allowNull: false, // sales step 2
    },
    description: {
      type: DataTypes.TEXT,
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false, // sales step 2
    },
    sold_by: {
      type: DataTypes.INTEGER,
      allowNull: false, // sales step 2
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
    tableName: "services",
    timestamps: true,
  }
);

module.exports = Service;
