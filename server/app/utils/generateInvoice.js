const PDFDocument = require("pdfkit");

const generateInvoicePDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // 🟩 **Invoice Title**
      doc
        .fontSize(16)
        .text("Proforma Invoice", { align: "center", underline: true });
      doc.moveDown(1);

      // 🟩 **Company Details (Inside a Box)**
      doc.rect(50, 80, 500, 60).stroke(); // Draws the box
      doc.fontSize(12).text("RICH SYSTEM SOLUTIONS PVT LTD.", 60, 90);
      doc.text(
        "FH-3&14, Thakkar Bazar, New CBS, Trimbak Road, Nashik - 422002",
        60,
        105
      );
      doc.text("GSTIN/UIN: 27AAFCR4096R2ZG | State: Maharashtra (27)", 60, 120);
      doc.text("E-Mail: accounts@richsol.com", 60, 135);
      doc.moveDown(1);

      // 🟩 **Invoice Details (Inside a Box)**
      doc.rect(50, 150, 500, 40).stroke();
      doc.text(`Invoice No: ${invoice.invoiceId}`, 60, 160);
      doc.text(`Date: ${invoice.date}`, 380, 160);
      doc.moveDown(1);

      // 🟩 **Buyer Details (Inside a Box)**
      doc.rect(50, 200, 500, 60).stroke();
      doc.text(`Buyer: ${invoice.buyer.name}`, 60, 210);
      doc.text(`Address: ${invoice.buyer.address}`, 60, 225);
      doc.text(`GSTIN/UIN: ${invoice.buyer.gstin}`, 60, 240);
      doc.text(
        `State: ${invoice.buyer.state} | Code: ${invoice.buyer.stateCode}`,
        60,
        255
      );
      doc.moveDown(1);

      // 🟩 **Table Header**
      let startY = 280;
      doc.rect(50, startY, 500, 25).fill("#d3d3d3").stroke(); // Table header background
      doc.fillColor("black");

      doc.fontSize(11).text("Sl No.", 55, startY + 7);
      doc.text("Description", 100, startY + 7);
      doc.text("HSN/SAC", 280, startY + 7);
      doc.text("Quantity", 350, startY + 7);
      doc.text("Rate", 420, startY + 7);
      doc.text("Amount", 480, startY + 7);

      startY += 25; // Move to the next row

      // 🟩 **Table Rows**
      if (invoice.items && invoice.items.length > 0) {
        invoice.items.forEach((item, index) => {
          doc.rect(50, startY, 500, 20).stroke(); // Row border
          doc.text(index + 1, 55, startY + 5);
          doc.text(item.description, 100, startY + 5);
          doc.text(item.hsn, 280, startY + 5);
          doc.text(item.quantity, 350, startY + 5);
          doc.text(Number(item.rate).toFixed(2), 420, startY + 5);
          doc.text(Number(item.amount).toFixed(2), 480, startY + 5);
          startY += 20;
        });
      } else {
        doc.text("No items found.", 55, startY + 5);
      }

      startY += 20; // Move to the next section

      // 🟩 **GST & Total Amount Box**
      doc.rect(50, startY, 500, 60).stroke();
      doc.text(
        `C GST @ ${invoice.gst.cgstPercent}%: ₹${(
          Number(invoice.totalAmount) *
          (invoice.gst.cgstPercent / 100)
        ).toFixed(2)}`,
        60,
        startY + 10
      );
      doc.text(
        `S GST @ ${invoice.gst.sgstPercent}%: ₹${(
          Number(invoice.totalAmount) *
          (invoice.gst.sgstPercent / 100)
        ).toFixed(2)}`,
        60,
        startY + 25
      );
      doc.text(
        `Total: ₹${Number(invoice.grandTotal).toFixed(2)}`,
        380,
        startY + 25,
        { align: "right" }
      );

      startY += 70; // Move to the next section

      // 🟩 **Bank Details Box**
      doc.rect(50, startY, 500, 50).stroke();
      doc.text("Company’s Bank Details", 60, startY + 10);
      doc.text(`Bank: ${invoice.bankDetails.bank}`, 60, startY + 25);
      doc.text(`A/c No.: ${invoice.bankDetails.account}`, 200, startY + 25);
      doc.text(
        `Branch: ${invoice.bankDetails.branch} | IFSC: ${invoice.bankDetails.ifsc}`,
        350,
        startY + 25
      );

      startY += 60; // Move to the next section

      // 🟩 **Declaration Box**
      doc.rect(50, startY, 500, 40).stroke();
      doc.text("Declaration", 60, startY + 10);
      doc.text(
        "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
        60,
        startY + 25
      );

      startY += 50; // Move to the signature section

      // 🟩 **Authorized Signatory**
      doc.text("For RICH SYSTEM SOLUTIONS PVT LTD.", 350, startY + 20);
      doc.text("Authorized Signatory", 350, startY + 40);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateInvoicePDF;
