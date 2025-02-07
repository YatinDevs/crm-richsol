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

const AddEmployee = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const steps = [
    {
      title: "Personal Info",
      icon: (
        <AiOutlineUser
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(0)}
        />
      ),
      content: (
        <>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            {" "}
            <Input placeholder="Enter username" />{" "}
          </Form.Item>
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
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            {" "}
            <Input placeholder="Enter phone number" />{" "}
          </Form.Item>
          <Form.Item name="alternate_phone" label="Alternate Phone">
            {" "}
            <Input placeholder="Enter alternate phone" />{" "}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Employment Details",
      icon: (
        <AiOutlineSolution
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(1)}
        />
      ),
      content: (
        <>
          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true, message: "Designation is required" }]}
          >
            {" "}
            <Input placeholder="Enter designation" />{" "}
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please select a department" }]}
          >
            <Select placeholder="Select department">
              <Option value="Development Team">Development Team</Option>
              <Option value="HR Team">HR Team</Option>
              <Option value="Marketing Team">Marketing Team</Option>
              <Option value="Interns">Interns</Option>
              <Option value="Sales Team">Sales Team</Option>
              <Option value="Support Team">Support Team</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
          <Form.Item name="address" label="Address">
            {" "}
            <Input.TextArea placeholder="Enter address" />{" "}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Work & Status",
      icon: (
        <AiOutlineLock
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(2)}
        />
      ),
      content: (
        <>
          <Form.Item name="joining_date" label="Joining Date">
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
          <Form.Item name="probation_end_date" label="Probation End Date">
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
          <Form.Item name="training_end_date" label="Training End Date">
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              <Option value="employee">Employee</Option>
              <Option value="admin">Admin</Option>
              <Option value="hr">HR</Option>
              <Option value="accounts">Accounts</Option>
              <Option value="sales">Sales</Option>
              <Option value="support">Support</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: "Additional Info",
      icon: (
        <AiOutlineCalendar
          className="text-xl cursor-pointer"
          onClick={() => setCurrentStep(3)}
        />
      ),
      content: (
        <>
          <Form.Item name="blood_group" label="Blood Group">
            {" "}
            <Input placeholder="Enter blood group" />{" "}
          </Form.Item>
          <Form.Item name="reference_contacts" label="Reference Contacts">
            {" "}
            <Input.TextArea placeholder="Enter reference contacts" />{" "}
          </Form.Item>
          <Form.Item name="attachments" label="Attachments">
            {" "}
            <Input.TextArea placeholder="Upload attachments" />{" "}
          </Form.Item>
        </>
      ),
    },
  ];

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  const handleFinish = (values) => {
    console.log("Employee Data:", values);
    message.success("Employee onboarded successfully");
  };

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
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

export default AddEmployee;
