const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Invoice = sequelize.define("Invoice", {
  invoiceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATEONLY, allowNull: true },
  buyer: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // Changed from FLOAT
  gst: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: { cgstPercent: 0, sgstPercent: 0, igstPercent: 0 },
  },
  grandTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // Changed from FLOAT
  bankDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  for_client_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Invoice;
