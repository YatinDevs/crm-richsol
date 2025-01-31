const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");
const Client = require("./clientModel");
const Service = require("./serviceModel");

const Sale = sequelize.define(
  "Sale",
  {
    sale_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.UUID,
      references: {
        model: Client,
        key: "client_id",
      },
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.UUID,
      references: {
        model: Service,
        key: "service_id",
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gst_value: {
      type: DataTypes.FLOAT,
    },
    total_amount: {
      type: DataTypes.FLOAT,
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
