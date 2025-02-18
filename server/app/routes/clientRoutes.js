// clientRoutes.js
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { checkRole } = require("../middlewares/roleMiddleware");
const { authenticate } = require("../middlewares/authMiddleware");

// CRUD operations

// Create a new client (Sales and Admin only)
router.get(
  "/search",
  authenticate,
  checkRole(["admin", "sales"]),
  clientController.searchClient
);
// Create a new client (Sales and Admin only)
router.post(
  "/create",
  authenticate,
  checkRole(["admin", "sales"]),
  clientController.createClient
);

// Get a client by ID (Admin only)
router.get(
  "/clients/:id",
  authenticate,
  checkRole(["admin"]),
  clientController.getClientById
);
// Update a client (Admin only)
router.put(
  "/clients/:id",
  authenticate,
  checkRole(["admin"]),

  clientController.updateClient
);

// Get all clients (Admin only, with optional status filter)
router.get(
  "/clients",
  authenticate,
  checkRole(["admin"]),
  clientController.getAllClients
);
// Deactivate a client (Admin only)
router.put(
  "/clients/:id/deactivate",
  authenticate,
  checkRole(["admin"]),
  clientController.deactivateClient
);
router.put(
  "/clients/:id/activate",
  authenticate,
  checkRole(["admin"]),
  clientController.activateClient
);
// Additional routes
router.get(
  "/clients/:id/sales",
  authenticate,
  checkRole(["admin"]),
  clientController.getClientSales
);
router.get(
  "/clients/:id/invoices",
  authenticate,
  checkRole(["admin"]),
  clientController.getClientInvoices
);

module.exports = router;
