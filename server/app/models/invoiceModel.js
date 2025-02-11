const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Client = require("./clientModel");
const Sale = require("./saleModel");

const Invoice = sequelize.define(
  "Invoice",
  {
    invoice_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount_due: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("unpaid", "paid", "overdue", "pending", "cancelled"),
      defaultValue: "pending",
    },
    issued_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "invoices",
    timestamps: true,
  }
);

module.exports = Invoice;
