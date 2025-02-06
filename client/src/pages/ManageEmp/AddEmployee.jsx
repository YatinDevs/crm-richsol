import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/employees", values);
      message.success(response.data.message);
      navigate("/dashboard/employees"); // Redirect after success
    } catch (error) {
      message.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-container mt-10 p-10">
      <h2 className="text-center p-2 m-2 font-bold">Create New Employee</h2>
      <Form
        name="addEmployeeForm"
        onFinish={onFinish}
        initialValues={{
          role: "employee", // Default role
        }}
        layout="vertical"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter the username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter the password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select the role!" }]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="hr">HR</Select.Option>
            <Select.Option value="employee">Employee</Select.Option>
            <Select.Option value="accounts">Accounts</Select.Option>
            <Select.Option value="sales">Sales</Select.Option>
            <Select.Option value="support">Support</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEmployee;
