const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");

const Service = sequelize.define(
  "Service",
  {
    service_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    service_name: {
      type: DataTypes.ENUM(
        "Website Development",
        "Mobile App Development",
        "Software Development",
        "Digital Marketing",
        "WhatsApp Tool Marketing",
        "Bulk SMS"
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    validity: {
      type: DataTypes.INTEGER, // In days
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
