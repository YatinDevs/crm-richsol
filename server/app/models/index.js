const sequelize = require("../utils/db");

const Employee = require("./employeeModel");
const Client = require("./clientModel");
const Service = require("./serviceModel");
const Sale = require("./saleModel");
const Invoice = require("./invoiceModel");
const Payroll = require("./payrollModel");
const Attendance = require("./attendanceModel");
const LeaveRequest = require("./leaveRequestModel");
const Expense = require("./expenseModel");
const Task = require("./taskModel");
const Notification = require("./notificationModel");

// Define associations
Employee.hasMany(Notification, { foreignKey: "user_id", as: "Notifications" });
Notification.belongsTo(Employee, { foreignKey: "user_id", as: "User" });

Employee.hasMany(Task, { foreignKey: "assigned_to", as: "AssignedTasks" });
Employee.hasMany(Task, { foreignKey: "assigned_by", as: "CreatedTasks" });
Task.belongsTo(Employee, { foreignKey: "assigned_to", as: "AssignedEmployee" });
Task.belongsTo(Employee, {
  foreignKey: "assigned_by",
  as: "AssignedByEmployee",
});
Task.belongsTo(Client, { foreignKey: "client_id", as: "Client" });
Task.belongsTo(Service, { foreignKey: "service_id", as: "Service" });
Employee.hasMany(Sale, { foreignKey: "employee_id", as: "Sales" });
Client.hasMany(Sale, { foreignKey: "client_id", as: "Sales" });
Sale.belongsTo(Client, { foreignKey: "client_id", as: "Client" });
Sale.belongsTo(Employee, { foreignKey: "employee_id", as: "Salesperson" });

Client.hasMany(Invoice, { foreignKey: "client_id", as: "Invoices" });
Invoice.belongsTo(Client, { foreignKey: "client_id", as: "Client" });

Employee.hasMany(Payroll, { foreignKey: "employee_id", as: "Payrolls" });
Employee.hasMany(Attendance, {
  foreignKey: "employee_id",
  as: "AttendanceRecords",
});
Employee.hasMany(LeaveRequest, {
  foreignKey: "employee_id",
  as: "LeaveRequests",
});

const models = {
  Employee,
  Client,
  Service,
  Sale,
  Invoice,
  Payroll,
  Attendance,
  LeaveRequest,
  Expense,
};

// Loop through models and apply associations if they exist
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, ...models };
