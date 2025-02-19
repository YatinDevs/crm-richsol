const Employee = require("./employeeModel");
const Client = require("./clientModel");
const Service = require("./serviceModel");
const Sale = require("./saleModel");
const Invoice = require("./invoiceModel");
const Task = require("./taskModel");

// Employee Associations
Employee.hasMany(Task, { foreignKey: "assigned_to", as: "tasks" });
Employee.hasMany(Task, { foreignKey: "assigned_by", as: "assignedTasks" });
Employee.hasMany(Client, { foreignKey: "onboarded_by", as: "clients" });
Employee.hasMany(Service, { foreignKey: "sold_by", as: "services" });
Employee.hasMany(Sale, { foreignKey: "employee_id", as: "sales" });

// Client Associations
Client.hasMany(Sale, { foreignKey: "client_id", as: "sales" });
Client.hasMany(Invoice, { foreignKey: "client_id", as: "invoices" });
Client.hasMany(Task, { foreignKey: "for_client_id", as: "tasks" });

// Service Associations
Service.hasMany(Sale, { foreignKey: "service_id", as: "sales" });
Service.hasMany(Task, { foreignKey: "for_service_id", as: "tasks" });

// Sale Associations
Sale.belongsTo(Client, { foreignKey: "client_id", as: "client" });
Sale.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });
Sale.belongsTo(Service, { foreignKey: "service_id", as: "service" });
Sale.hasOne(Invoice, { foreignKey: "sale_id", as: "invoice" });

// Invoice Associations
Invoice.belongsTo(Client, { foreignKey: " for_client_id", as: "client" });

// Task Associations
Task.belongsTo(Employee, { foreignKey: "assigned_to", as: "assignedTo" });
Task.belongsTo(Employee, { foreignKey: "assigned_by", as: "assignedBy" });
Task.belongsTo(Client, { foreignKey: "for_client_id", as: "client" });
Task.belongsTo(Service, { foreignKey: "for_service_id", as: "service" });

module.exports = {
  Employee,
  Client,
  Service,
  Sale,
  Invoice,
  Task,
};
