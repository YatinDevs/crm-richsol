import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "antd";
import axiosInstance from "../../services/api";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineLock,
} from "react-icons/ai";
import { useLocation } from "react-router-dom";

const { Step } = Steps;
const { Option } = Select;

const ClientForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handlePrev = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };

      // Convert date objects to string format
      Object.keys(finalData).forEach((key) => {
        if (dayjs.isDayjs(finalData[key])) {
          finalData[key] = finalData[key].format("YYYY-MM-DD");
        }
      });
      console.log(finalData);
      const response = await axiosInstance.post("/client/create", finalData);
      console.log(response);
      if (response.data.success) {
        message.success("Client onboarded successfully");
        form.resetFields();
        setFormData({});
        setCurrentStep(0);
        navigate("/dashboard/services/add", {
          state: { client: response.data.client },
        });
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
        <Step
          title="Client Details"
          icon={<AiOutlineUser />}
          onClick={() => setCurrentStep(0)}
        />
        <Step
          title="Business Info"
          icon={<AiOutlineSolution />}
          onClick={() => setCurrentStep(1)}
        />
        <Step
          title="Client Credentials"
          icon={<AiOutlineLock />}
          onClick={() => setCurrentStep(2)}
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
            <Form.Item
              name="company_name"
              label="Company Name"
              rules={[{ required: true, message: "Company Name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="owner_name"
              label="Owner Name"
              rules={[{ required: true, message: "Owner Name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="owner_phone"
              label="Owner Phone"
              rules={[
                { required: true, message: "Phone number is required" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input.TextArea />
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item
              name="service_type"
              label="Service Type"
              rules={[
                { required: true, message: "Please select a service type" },
              ]}
            >
              <Select>
                <Option value="GST">GST</Option>
                <Option value="Non-GST">Non-GST</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="gst_number"
              label="GST Number"
              rules={[
                {
                  pattern: /^[0-9A-Z]{15}$/,
                  message: "Enter a valid GST number",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="coordinator_name" label="Coordinator Name">
              <Input />
            </Form.Item>
            <Form.Item
              name="coordinator_phone"
              label="Coordinator Phone"
              rules={[
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Form.Item
              name="priority_level"
              label="Priority Level"
              rules={[
                { required: true, message: "Please select a priority level" },
              ]}
            >
              <Select>
                <Option value="Normal">Normal</Option>
                <Option value="High">High</Option>
                <Option value="Critical">Critical</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Enter a valid email",
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            <Form.Item name="notes" label="Additional Notes">
              <Input.TextArea />
            </Form.Item>
          </>
        )}

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
