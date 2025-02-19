const express = require("express");
const router = express.Router();
const {
  generateInvoicePDF,
  createInvoice,
  getInvoice,
} = require("../controllers/invoiceController");

router.get("/generate/:invoiceId", generateInvoicePDF);
router.post("/create", createInvoice);
router.get("/fetch", getInvoice);

module.exports = router;
