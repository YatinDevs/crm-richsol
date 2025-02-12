const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: { type: DataTypes.ENUM("proforma", "tax"), allowNull: false },
  invoiceNo: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  company: { type: DataTypes.JSONB, allowNull: false },
  buyer: { type: DataTypes.JSONB, allowNull: false },
  items: { type: DataTypes.JSONB, allowNull: false },
  totalTax: { type: DataTypes.FLOAT, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  amountInWords: { type: DataTypes.STRING, allowNull: false },
  bank: { type: DataTypes.JSONB },
});

module.exports = Invoice;
