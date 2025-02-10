import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Form, Input, Button, Select, Steps, DatePicker, message } from "antd";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineLock,
  AiOutlineCalendar,
} from "react-icons/ai";
import axiosInstance from "../../services/api";

const { Step } = Steps;

const ClientForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // Default form data
  const defaultFormData = {
    company_name: "",
    address: "",
    owner_name: "",
    owner_phone: "",
    service_type: "",
    gst_number: "",
    panel_name: "",
    purchased_products: "",
    email: "",
    password: "",
    status: "active",
    priority_level: "Normal",
    recharge_date: null,
    validity_expire_date: null,
    last_recharge_date: null,
  };

  // Persist form data across steps
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);
  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => {
        const updatedData = { ...prev, ...values };
        return updatedData;
      });

      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 100); // Ensures state updates before step change
    } catch (error) {
      message.error("Please fill all required fields");
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const handleFinish = async () => {
    if (currentStep !== 3) return; // Prevents submission before step
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };

      // Format dates correctly
      Object.keys(finalData).forEach((key) => {
        if (dayjs.isDayjs(finalData[key])) {
          finalData[key] = finalData[key].format("YYYY-MM-DD");
        }
      });

      const response = await axiosInstance.post(
        "http://localhost:8098/api/v1/client/create-client",
        finalData
      );

      if (response.data.success) {
        message.success("Client onboarded successfully");
        form.resetFields();
        setFormData(defaultFormData);
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Failed to add client");
      }
    } catch (error) {
      message.error("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep}>
        <Step
          title="Personal Info"
          icon={<AiOutlineUser />}
          onClick={() => setCurrentStep(0)}
        />
        <Step
          title="Business Details"
          icon={<AiOutlineSolution />}
          onClick={() => setCurrentStep(1)}
        />
        <Step
          title="Work & Status"
          icon={<AiOutlineLock />}
          onClick={() => setCurrentStep(2)}
        />
        <Step
          title="Additional Info"
          icon={<AiOutlineCalendar />}
          onClick={() => setCurrentStep(3)}
        />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-6"
      >
        {currentStep === 0 && (
          <PersonalInfoStep form={form} formData={formData} />
        )}
        {currentStep === 1 && (
          <BusinessDetailsStep form={form} formData={formData} />
        )}
        {currentStep === 2 && (
          <WorkStatusStep form={form} formData={formData} />
        )}
        {currentStep === 3 && (
          <AdditionalInfoStep form={form} formData={formData} />
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 0 && <Button onClick={prev}>Back</Button>}
          {currentStep < 3 ? (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default ClientForm;

const BusinessDetailsStep = () => (
  <>
    <Form.Item
      name="service_type"
      label="Service Type"
      rules={[{ required: true }]}
    >
      <Select placeholder="Select service type">
        <Select.Option value="GST">GST</Select.Option>
        <Select.Option value="Non-GST">Non-GST</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item name="gst_number" label="GST Number">
      <Input placeholder="Enter GST number" />
    </Form.Item>
    <Form.Item name="panel_name" label="Panel Name">
      <Input placeholder="Enter panel name" />
    </Form.Item>
    <Form.Item name="purchased_products" label="Purchased Products">
      <Input.TextArea placeholder="List purchased products" />
    </Form.Item>
  </>
);
const PersonalInfoStep = () => (
  <>
    <Form.Item
      name="company_name"
      label="Company Name"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter company name" />
    </Form.Item>
    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
      <Input.TextArea placeholder="Enter address" />
    </Form.Item>
    <Form.Item
      name="owner_name"
      label="Owner Name"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter owner name" />
    </Form.Item>
    <Form.Item
      name="owner_phone"
      label="Owner Phone"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter owner phone" />
    </Form.Item>
  </>
);

const WorkStatusStep = () => (
  <>
    <Form.Item
      name="email"
      label="Email"
      rules={[{ required: true, type: "email" }]}
    >
      <Input placeholder="Enter email" />
    </Form.Item>
    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
      <Input.Password placeholder="Enter password" />
    </Form.Item>
    <Form.Item name="status" label="Status">
      <Select>
        <Select.Option value="active">Active</Select.Option>
        <Select.Option value="inactive">Inactive</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item name="priority_level" label="Priority Level">
      <Select>
        <Select.Option value="Normal">Normal</Select.Option>
        <Select.Option value="High">High</Select.Option>
        <Select.Option value="Critical">Critical</Select.Option>
      </Select>
    </Form.Item>
  </>
);

const AdditionalInfoStep = () => (
  <>
    <Form.Item name="recharge_date" label="Recharge Date">
      <DatePicker className="w-full" />
    </Form.Item>
    <Form.Item name="validity_expire_date" label="Validity Expiry Date">
      <DatePicker className="w-full" />
    </Form.Item>
    <Form.Item name="last_recharge_date" label="Last Recharge Date">
      <DatePicker className="w-full" />
    </Form.Item>
  </>
);
