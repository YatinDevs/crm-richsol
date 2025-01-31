const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Expense = sequelize.define(
  "Expense",
  {
    expense_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category: {
      type: DataTypes.ENUM(
        "salary",
        "marketing",
        "infrastructure",
        "software",
        "miscellaneous"
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "expenses",
    timestamps: true,
  }
);

module.exports = Expense;
