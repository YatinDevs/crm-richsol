import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, Table, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const InvoiceGenerator = () => {
  const [invoiceType, setInvoiceType] = useState("proforma"); // Default to Proforma
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([...items, { key: items.length, description: "", hsn: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      items,
    };

    try {
      const endpoint =
        invoiceType === "proforma" ? "generate-proforma" : "generate-tax";
      const response = await axios.post(
        `http://localhost:8098/api/v1/invoice/generate-${endpoint}`,
        formData,
        { responseType: "blob" }
      );

      // Create a URL for the PDF and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceType}_invoice.pdf`);
      document.body.appendChild(link);
      link.click();
      message.success("Invoice generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate invoice");
    }
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, record, index) => (
        <Input
          value={record.description}
          onChange={(e) =>
            handleItemChange(index, "description", e.target.value)
          }
        />
      ),
    },
    {
      title: "HSN/SAC",
      dataIndex: "hsn",
      key: "hsn",
      render: (_, record, index) => (
        <Input
          value={record.hsn}
          onChange={(e) => handleItemChange(index, "hsn", e.target.value)}
        />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Generate Invoice</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          invoiceType: "proforma",
        }}
      >
        {/* Invoice Type */}
        <Form.Item label="Invoice Type" name="invoiceType">
          <Select value={invoiceType} onChange={setInvoiceType}>
            <Option value="proforma">Proforma Invoice</Option>
            <Option value="tax">Tax Invoice</Option>
          </Select>
        </Form.Item>

        {/* Invoice No & Date */}
        <Form.Item
          label="Invoice No"
          name="invoiceNo"
          rules={[{ required: true, message: "Enter Invoice No" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Select Date" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        {/* Buyer Details */}
        <h3>Buyer Details</h3>
        <Form.Item
          label="Name"
          name={["buyer", "name"]}
          rules={[{ required: true, message: "Enter Buyer Name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name={["buyer", "address"]}
          rules={[{ required: true, message: "Enter Address" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="GSTIN/UIN"
          name={["buyer", "gstin"]}
          rules={[{ required: true, message: "Enter GSTIN/UIN" }]}
        >
          <Input />
        </Form.Item>

        {/* Items Table */}
        <h3>Items</h3>
        <Table dataSource={items} columns={columns} pagination={false} />

        <Button type="dashed" onClick={addItem} style={{ marginTop: 10 }}>
          Add Item
        </Button>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary" htmlType="submit">
            Generate PDF
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InvoiceGenerator;
