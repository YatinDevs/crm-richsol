// saleRoutes.js
const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");

// CRUD operations
router.post("/sales", saleController.createSale);
router.get("/sales", saleController.getAllSales);
router.get("/sales/:id", saleController.getSaleById);
router.put("/sales/:id", saleController.updateSale);
router.delete("/sales/:id", saleController.deleteSale);

module.exports = router;
