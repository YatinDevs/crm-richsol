import { useState } from "react";
import { Form, Input, Button, Select, Steps, DatePicker, message } from "antd";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineLock,
  AiOutlineCalendar,
} from "react-icons/ai";

const { Step } = Steps;
const { Option } = Select;

const ClientForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const steps = [
    {
      title: "Basic Info",
      icon: (
        <AiOutlineUser
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(0)}
        />
      ),
      content: (
        <>
          <Form.Item
            name="company_name"
            label="Company Name"
            rules={[{ required: true, message: "Company name is required" }]}
          >
            {" "}
            <Input placeholder="Enter company name" />{" "}
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            {" "}
            <Input.TextArea placeholder="Enter address" />{" "}
          </Form.Item>
          <Form.Item
            name="owner_name"
            label="Owner Name"
            rules={[{ required: true, message: "Owner name is required" }]}
          >
            {" "}
            <Input placeholder="Enter owner name" />{" "}
          </Form.Item>
          <Form.Item
            name="owner_phone"
            label="Owner Phone"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            {" "}
            <Input placeholder="Enter owner phone" />{" "}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Business Details",
      icon: (
        <AiOutlineSolution
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(1)}
        />
      ),
      content: (
        <>
          <Form.Item
            name="service_type"
            label="Service Type"
            rules={[{ required: true, message: "Please select service type" }]}
          >
            {" "}
            <Select placeholder="Select service type">
              {" "}
              <Option value="GST">GST</Option>{" "}
              <Option value="Non-GST">Non-GST</Option>{" "}
            </Select>{" "}
          </Form.Item>
          <Form.Item name="gst_number" label="GST Number">
            {" "}
            <Input placeholder="Enter GST number" />{" "}
          </Form.Item>
          <Form.Item name="panel_name" label="Panel Name">
            {" "}
            <Input placeholder="Enter panel name" />{" "}
          </Form.Item>
          <Form.Item name="purchased_products" label="Purchased Products">
            {" "}
            <Input.TextArea placeholder="List purchased products" />{" "}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Credentials & Status",
      icon: (
        <AiOutlineLock
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(2)}
        />
      ),
      content: (
        <>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Enter a valid email" },
            ]}
          >
            {" "}
            <Input placeholder="Enter email" />{" "}
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            {" "}
            <Input.Password placeholder="Enter password" />{" "}
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            {" "}
            <Select placeholder="Select status">
              {" "}
              <Option value="active">Active</Option>{" "}
              <Option value="inactive">Inactive</Option>{" "}
            </Select>{" "}
          </Form.Item>
          <Form.Item name="priority_level" label="Priority Level">
            {" "}
            <Select placeholder="Select priority level">
              {" "}
              <Option value="Normal">Normal</Option>{" "}
              <Option value="High">High</Option>{" "}
              <Option value="Critical">Critical</Option>{" "}
            </Select>{" "}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Recharge & Validity",
      icon: (
        <AiOutlineCalendar
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(3)}
        />
      ),
      content: (
        <>
          <Form.Item name="recharge_date" label="Recharge Date">
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
          <Form.Item name="validity_expire_date" label="Validity Expiry Date">
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
          <Form.Item name="last_recharge_date" label="Last Recharge Date">
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
        </>
      ),
    },
  ];

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  const handleFinish = (values) => {
    console.log("Client Data:", values);
    message.success("Client added successfully");
  };

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            icon={step.icon}
            className="flex justify-center items-center"
          />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-6"
      >
        {steps[currentStep].content}

        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button onClick={prev} className="bg-gray-500 text-white">
              {" "}
              Back{" "}
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={next} className="bg-blue-500">
              {" "}
              Next{" "}
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" className="bg-green-500">
              {" "}
              Submit{" "}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default ClientForm;
