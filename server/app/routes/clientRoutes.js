// clientRoutes.js
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// CRUD operations
router.post("/clients", clientController.createClient);
router.get("/clients", clientController.getAllClients);
router.get("/clients/:id", clientController.getClientById);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);

// Additional routes
router.get("/clients/:id/sales", clientController.getClientSales);
router.get("/clients/:id/invoices", clientController.getClientInvoices);

module.exports = router;
