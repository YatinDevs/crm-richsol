import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Space,
  Steps,
  InputNumber,
} from "antd";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineLock,
} from "react-icons/ai";
import axiosInstance from "../../services/api";

const { Step } = Steps;

const MultiStepInvoiceForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({}); // Store form values persistently

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };
  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };

      Object.keys(finalData).forEach((key) => {
        if (finalData[key] instanceof dayjs) {
          finalData[key] = finalData[key].format("YYYY-MM-DD");
        }
      });
      console.log(finalData, `Data`);
      const response = await axiosInstance.post("/invoice/create", finalData);

      if (response.data.success) {
        message.success("Employee onboarded successfully");
        form.resetFields();
        setFormData({});
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Failed to add employee");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(error.response?.data?.message || "An error occurred");
    }
  };
  const calculateAmount = (index) => {
    const items = form.getFieldValue("items") || [];
    if (items[index]) {
      items[index].amount =
        items[index].quantity && items[index].rate
          ? items[index].quantity * items[index].rate
          : undefined;
      form.setFieldsValue({ items });
      calculateTotalAmount();
    }
  };

  const calculateTax = () => {
    const totalAmount = form.getFieldValue("totalAmount") || 0;
    const gst = form.getFieldValue("gst") || {};

    const cgst = (totalAmount * (gst.cgstPercent || 0)) / 100;
    const sgst = (totalAmount * (gst.sgstPercent || 0)) / 100;
    const igst = (totalAmount * (gst.igstPercent || 0)) / 100;
    const grandTotal = totalAmount + cgst + sgst + igst;

    form.setFieldsValue({
      gst: { ...gst, cgst, sgst, igst },
      grandTotal, // Auto-update Grand Total
    });

    setFormData(form.getFieldsValue(true)); // Persist data
  };

  const calculateTotalAmount = () => {
    const items = form.getFieldValue("items") || [];
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    form.setFieldsValue({ totalAmount });
    calculateTax();
  };

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep}>
        <Step
          title="Invoice Details"
          icon={<AiOutlineUser />}
          onClick={() => setCurrentStep(0)}
        />
        <Step
          title="Buyer Details"
          icon={<AiOutlineSolution />}
          onClick={() => setCurrentStep(1)}
        />
        <Step
          title="Item Details"
          icon={<AiOutlineSolution />}
          onClick={() => setCurrentStep(2)}
        />
        <Step
          title="Tax Details"
          icon={<AiOutlineSolution />}
          onClick={() => setCurrentStep(3)}
        />
        <Step
          title="Bank Details"
          icon={<AiOutlineSolution />}
          onClick={() => setCurrentStep(4)}
        />
        <Step
          title="Summary & Submit"
          icon={<AiOutlineLock />}
          onClick={() => setCurrentStep(5)}
        />
      </Steps>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        className="mt-6"
      >
        {currentStep === 0 && (
          <>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
          </>
        )}
        {currentStep === 1 && (
          <>
            <Form.Item
              name={["buyer", "name"]}
              label="Buyer Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["buyer", "address"]}
              label="Address"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name={["buyer", "gstin"]}
              label="GSTIN/UIN"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>{" "}
            <Form.Item
              name={["buyer", "state"]}
              label="State"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>{" "}
            <Form.Item
              name={["buyer", "stateCode "]}
              label="State Code"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        )}
        {currentStep === 2 && (
          <>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <div
                      key={key}
                      style={{ marginBottom: 10, display: "flex", gap: 10 }}
                    >
                      <Form.Item name={[name, "description"]}>
                        <Input placeholder="Description" style={{ flex: 2 }} />
                      </Form.Item>
                      <Form.Item name={[name, "hsn"]}>
                        <Input placeholder="HSN/SAC" style={{ flex: 1 }} />
                      </Form.Item>
                      <Form.Item name={[name, "quantity"]}>
                        <InputNumber
                          placeholder="Qty"
                          style={{ flex: 1 }}
                          onChange={() => calculateAmount(name)}
                        />
                      </Form.Item>
                      <Form.Item name={[name, "rate"]}>
                        <InputNumber
                          placeholder="Rate"
                          style={{ flex: 1 }}
                          onChange={() => calculateAmount(name)}
                        />
                      </Form.Item>
                      <Form.Item name={[name, "amount"]}>
                        <InputNumber
                          placeholder="Amount"
                          style={{ flex: 1 }}
                          disabled
                        />
                      </Form.Item>
                      <Button danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()}>
                    Add Item
                  </Button>
                </>
              )}
            </Form.List>
          </>
        )}
        {currentStep === 3 && (
          <>
            <Form.Item name={["gst", "cgstPercent"]} label="CGST (%)">
              <InputNumber onChange={calculateTax} />
            </Form.Item>
            <Form.Item name={["gst", "sgstPercent"]} label="SGST (%)">
              <InputNumber onChange={calculateTax} />
            </Form.Item>
            <Form.Item name={["gst", "igstPercent"]} label="IGST (%)">
              <InputNumber onChange={calculateTax} />
            </Form.Item>
            <Form.Item name="totalAmount" label="Total Amount">
              <InputNumber disabled />
            </Form.Item>
          </>
        )}
        {currentStep === 4 && (
          <>
            <Form.Item
              name={["bankDetails", "bank"]}
              label="Bank Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["bankDetails", "account"]}
              label="Account Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>{" "}
            <Form.Item
              name={["bankDetails", "branch"]}
              label="Branch Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>{" "}
            <Form.Item
              name={["bankDetails", "ifsc"]}
              label="IFSC Code"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        )}
        {currentStep === 5 && (
          <>
            <Form.Item name="totalAmount" label="Total Amount">
              <InputNumber disabled />
            </Form.Item>
            <Form.Item name="grandTotal" label="Grand Total">
              <InputNumber disabled />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </>
        )}
        <Space className="mt-6">
          {currentStep > 0 && (
            <Button onClick={handlePrev} className="bg-gray-500 text-white">
              Back
            </Button>
          )}
          {currentStep < 5 ? (
            <Button type="primary" onClick={handleNext} className="bg-blue-500">
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-green-500"
            >
              Submit
            </Button>
          )}
        </Space>
      </Form>
    </div>
  );
};

export default MultiStepInvoiceForm;
