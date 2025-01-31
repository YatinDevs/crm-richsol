const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Client = require("./clientModel");
const Sale = require("./saleModel");

const Invoice = sequelize.define(
  "Invoice",
  {
    invoice_id: {
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
    sale_id: {
      type: DataTypes.UUID,
      references: {
        model: Sale,
        key: "sale_id",
      },
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
      type: DataTypes.ENUM("unpaid", "paid", "overdue"),
      defaultValue: "unpaid",
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
