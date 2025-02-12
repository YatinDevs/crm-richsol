const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Invoice = require("../models/invoiceModel");

// Function to generate a PDF invoice
const generatePDF = async (invoice, res) => {
  const doc = new PDFDocument();
  const filePath = path.join(
    __dirname,
    `../public/${invoice.type}_invoice_${invoice.invoiceNo}.pdf`
  );
  doc.pipe(fs.createWriteStream(filePath));

  // Title
  doc
    .fontSize(20)
    .text(`${invoice.type.toUpperCase()} INVOICE`, { align: "center" })
    .moveDown();

  // Company Details
  doc.fontSize(14).text(invoice.company.name, { align: "center" });
  doc.text(`GSTIN: ${invoice.company.gstin}`, { align: "center" });
  doc.text(`State: ${invoice.company.state}, Code: ${invoice.company.code}`, {
    align: "center",
  });
  doc.text(`Email: ${invoice.company.email}`).moveDown();

  // Invoice Details
  doc.text(`Invoice No: ${invoice.invoiceNo}`);
  doc.text(`Date: ${invoice.date}`).moveDown();

  // Buyer Details
  doc.text(`Buyer: ${invoice.buyer.name}`);
  doc.text(`Address: ${invoice.buyer.address}`);
  doc.text(`GSTIN: ${invoice.buyer.gstin}`).moveDown();

  // Table Headers
  doc
    .fontSize(12)
    .text("Sl No.   Description   HSN/SAC   Quantity   Rate   Amount", {
      underline: true,
    });

  // Items
  invoice.items.forEach((item, index) => {
    doc.text(
      `${index + 1}    ${item.description}    ${item.hsn}    ${
        item.quantity
      }    ₹${item.rate}    ₹${item.amount}`
    );
  });

  // Tax & Total
  doc.moveDown().text(`Total Tax: ₹${invoice.totalTax}`);
  doc.text(`Total Amount: ₹${invoice.totalAmount}`);
  doc.text(`Amount in Words: ${invoice.amountInWords}`).moveDown();

  // Bank Details (only for Tax Invoice)
  if (invoice.type === "tax") {
    doc.text(`Bank: ${invoice.bank.name}`);
    doc.text(`Account No.: ${invoice.bank.account}`);
    doc.text(`IFSC: ${invoice.bank.ifsc}`).moveDown();
  }

  doc.text("For " + invoice.company.name, { align: "right" });

  doc.end();

  doc.on("end", () => {
    res.download(filePath, `${invoice.type}_invoice.pdf`, (err) => {
      if (err) console.error("Error sending file:", err);
    });
  });
};

// Controller for creating an invoice
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    generatePDF(invoice, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch all invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
