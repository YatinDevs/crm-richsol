const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Employee = require("./employeeModel");

const Attendance = sequelize.define(
  "Attendance",
  {
    attendance_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "leave"),
      allowNull: false,
    },
    check_in: {
      type: DataTypes.TIME,
    },
    check_out: {
      type: DataTypes.TIME,
    },
  },
  {
    tableName: "attendance",
    timestamps: true,
  }
);

module.exports = Attendance;
