const Invoice = require("../models/invoiceModel");
const generateInvoicePDF = require("../utils/generateInvoice");
exports.createInvoice = async (req, res) => {
  try {
    console.log(req.body);
    let invoiceData = { ...req.body };

    // Fix "stateCode " issue
    if (invoiceData.buyer?.["stateCode "]) {
      invoiceData.buyer.stateCode = invoiceData.buyer["stateCode "];
      delete invoiceData.buyer["stateCode "];
    }

    // Fix floating point precision
    invoiceData.totalAmount = parseFloat(invoiceData.totalAmount.toFixed(2));
    invoiceData.grandTotal = parseFloat(invoiceData.grandTotal.toFixed(2));

    // Ensure for_client_id exists
    invoiceData.for_client_id = invoiceData.for_client_id || null;

    const invoice = await Invoice.create(invoiceData);
    console.log(invoice, `Generated`);

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res
      .status(500)
      .json({ message: "Error creating invoice", error: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error });
  }
};

exports.generateInvoicePDF = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    console.log(`Fetching invoice with ID: ${invoiceId}`);

    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    console.log("Invoice data:", invoice);

    // Generate the PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Proforma_Invoice_${invoiceId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
};
