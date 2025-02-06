import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";

const { Option } = Select;

const ManageEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/emp/get-employee"); // Replace with your actual API endpoint
      const data = response.data;
      setEmployees(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching employees", error);
      setEmployees([]); // Fallback to empty array on error
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Create or update employee
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Create new employee
      const res = await axiosInstance.post(
        "api/v1/emp/create-employee",
        values
      ); // Replace with your API endpoint
      console.log(res, `Employee creation`);
      message.success("Employee created successfully");

      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      message.error("Error saving employee data");
    } finally {
      setLoading(false);
    }
  };

  // Open the modal to add or update employee
  const openModal = (employee = null) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`); // Replace with your API endpoint
      message.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      message.error("Error deleting employee");
    }
  };

  // Employee table columns
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button onClick={() => openModal(record)}>Edit</Button>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Manage Employees</h2>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 20 }}
      >
        Add Employee
      </Button>
      <Table
        dataSource={Array.isArray(employees) ? employees : []} // Ensure it's an array
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      {/* Modal for creating/updating employee */}
      <Modal
        title={currentEmployee ? "Edit Employee" : "Add Employee"}
        open={isModalOpen} // Use open prop instead of visible
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form initialValues={currentEmployee} onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter the username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: !currentEmployee,
                message: "Please enter a password",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="hr">HR</Option>
              <Option value="employee">Employee</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              {currentEmployee ? "Update Employee" : "Add Employee"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageEmployees;
