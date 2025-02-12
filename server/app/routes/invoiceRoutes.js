// invoiceRoutes.js
const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

// CRUD operations

router.post("/generate-invoice", invoiceController.createInvoice);
router.get("/invoices", invoiceController.getInvoices);

module.exports = router;
