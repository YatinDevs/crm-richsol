import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Form, Input, Button, Select, Steps, Space, message } from "antd";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineLock,
  AiOutlineCalendar,
} from "react-icons/ai";
import axiosInstance from "../../services/api";
import useAuthStore from "../../store/authStore";

const { Step } = Steps;

const ClientForm = () => {
  const { employee } = useAuthStore();
  useEffect(() => {
    console.log(employee);
    setFormData({ onboarded_by: employee?.id });
  }, []);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  console.log(formData);

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

      const response = await axiosInstance.post("/client/create", finalData);

      if (response.data.success) {
        message.success("Client onboarded successfully");
        form.resetFields();
        setFormData({ onboarded_by: employee.id });
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Failed to add client");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep}>
        <Step title="Personal Info" icon={<AiOutlineUser />} />
        <Step title="Business Details" icon={<AiOutlineSolution />} />
        <Step title="Work & Status" icon={<AiOutlineLock />} />
        <Step title="Additional Info" icon={<AiOutlineCalendar />} />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        className="mt-6"
      >
        {currentStep === 0 && <PersonalInfoStep />}
        {currentStep === 1 && <BusinessDetailsStep />}
        {currentStep === 2 && <CreatingCredentials />}

        <Space className="mt-6">
          {currentStep > 0 && (
            <Button onClick={handlePrev} className="bg-gray-500 text-white">
              Back
            </Button>
          )}
          {currentStep < 2 ? (
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

export default ClientForm;

const PersonalInfoStep = () => (
  <>
    <Form.Item
      name="company_name"
      label="Company Name"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter company name" />
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
    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
      <Input.TextArea placeholder="Enter address" />
    </Form.Item>
  </>
);

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
    <Form.Item
      name="coordinator_name"
      label="Coordinator Name"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter coordinator name" />
    </Form.Item>
    <Form.Item
      name="coordinator_phone"
      label="Coordinator Phone"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter coordinator phone" />
    </Form.Item>
    <Form.Item name="panel_name" label="Panel Name">
      <Input placeholder="Enter panel name" />
    </Form.Item>
    <Form.Item name="purchased_products" label="Purchased Products">
      <Input.TextArea placeholder="List purchased products" />
    </Form.Item>
  </>
);

const CreatingCredentials = () => (
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
    <Form.Item name="priority_level" label="Priority Level">
      <Select>
        <Select.Option value="Normal">Normal</Select.Option>
        <Select.Option value="High">High</Select.Option>
        <Select.Option value="Critical">Critical</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item name="notes" label="Notes">
      <Input.TextArea placeholder="Enter notes" />
    </Form.Item>
  </>
);
