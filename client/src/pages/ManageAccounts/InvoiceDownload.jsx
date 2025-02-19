import React, { useState } from "react";
import axios from "axios";

const InvoiceDownload = () => {
  const [invoiceId, setInvoiceId] = useState("");

  const downloadInvoicePDF = async () => {
    if (!invoiceId) {
      alert("Please enter an Invoice ID");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8098/api/v1/invoice/generate/${invoiceId}`,
        { responseType: "blob" }
      );
      console.log(response);

      // Create a URL for the PDF blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice_${invoiceId}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice. Please check the Invoice ID.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input
        type="text"
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        placeholder="Enter Invoice ID"
        className="border rounded-md px-3 py-2"
      />
      <button
        onClick={downloadInvoicePDF}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Download Invoice
      </button>
    </div>
  );
};

export default InvoiceDownload;
