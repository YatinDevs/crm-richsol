import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Form, Input, Button, Select, DatePicker, message, Steps } from "antd";
import axiosInstance from "../../services/api";

const { Option } = Select;
const { Step } = Steps;

const EmployeeEditForm = () => {
  const location = useLocation();
  const { record } = location.state || {};
  const { id } = useParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (record) {
      setFormData(record);
      form.setFieldsValue({
        ...record,
        dob: record.dob ? dayjs(record.dob) : null,
        joining_date: record.joining_date ? dayjs(record.joining_date) : null,
        probation_end_date: record.probation_end_date
          ? dayjs(record.probation_end_date)
          : null,
        training_end_date: record.training_end_date
          ? dayjs(record.training_end_date)
          : null,
        increment_date: record.increment_date
          ? dayjs(record.increment_date)
          : null,
        anniversary_date: record.anniversary_date
          ? dayjs(record.anniversary_date)
          : null,
      });
    }
  }, [record]);

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error("Please fill all required fields before proceeding.");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };
      Object.keys(finalData).forEach((key) => {
        if (finalData[key] instanceof dayjs) {
          finalData[key] = finalData[key].format("YYYY-MM-DD");
        }
      });

      const response = await axiosInstance.put(
        `/emp/update-employee/${id}`,
        finalData
      );
      if (response.data.success) {
        message.success("Employee updated successfully");
      } else {
        message.error(response.data.message || "Failed to update employee");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await form.validateFields([
        "new_password",
        "confirm_password",
      ]);
      const { new_password } = values;
      const response = await axiosInstance.put(`/emp/change-password/${id}`, {
        new_password,
      });
      if (response.data.success) {
        message.success("Password updated successfully");
      } else {
        message.error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      message.error(
        "Password change failed. Ensure fields are correctly filled."
      );
    }
  };

  const steps = [
    {
      title: "Basic Info",
      content: (
        <>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="email" label="Email">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="phone" label="Phone Number">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="designation" label="Designation">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="department" label="Department">
            {" "}
            <Select>
              {" "}
              <Option value="Development Team">Development Team</Option>{" "}
            </Select>{" "}
          </Form.Item>
          <Form.Item name="role" label="Role">
            {" "}
            <Select>
              {" "}
              <Option value="employee">Employee</Option>{" "}
            </Select>{" "}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Employment Details",
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
        </>
      ),
    },
    {
      title: "Additional Info",
      content: (
        <>
          <Form.Item name="reference_contacts" label="Reference Contacts">
            {" "}
            <Input.TextArea />{" "}
          </Form.Item>
          <Form.Item name="attachments" label="Attachments">
            {" "}
            <Input.TextArea />{" "}
          </Form.Item>
        </>
      ),
    },
    {
      title: "Change Password",
      content: (
        <>
          <Form.Item
            name="new_password"
            label="New Password"
            rules={[
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            {" "}
            <Input.Password />{" "}
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            dependencies={["new_password"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            {" "}
            <Input.Password />{" "}
          </Form.Item>
          <Button type="primary" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold">Edit Employee</h2>
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <Form form={form} layout="vertical" className="mt-6">
        {steps[currentStep].content}
      </Form>
      <div className="flex justify-between mt-4">
        {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
        {currentStep < steps.length - 1 ? (
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeEditForm;
