import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Descriptions, Typography } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/api";
import moment from "moment";
import EmployeeEditForm from "./EmployeeEditForm";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const EmployeeList = () => {
  const navigate = useNavigate();

  const handleEdit = (record) => {
    navigate(`/dashboard/employees/edit/${record.id}`, { state: { record } });
  };
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/emp/get-employee");
      setEmployees(response.data.employeeDetails);
    } catch (error) {
      message.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await axiosInstance.post(`/emp/delete-employee/${id}`, {
        status: "inactive",
      });
      console.log(response);
      message.success("Employee deleted successfully.");
      fetchEmployees();
    } catch (error) {
      message.error("Failed to delete employee.");
    }
  };

  const showModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formatDate = (date) =>
    date ? moment(date).format("DD MMM YYYY ") : "N/A";

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
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showModal(record)}
          />

          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />

          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteEmployee(record.id)}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div className="add-employee-container mt-10 p-10">
      <h2 className="text-center p-2 m-2 font-bold">Employee List</h2>
      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Employee Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        {selectedEmployee && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Username">
              {selectedEmployee.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedEmployee.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedEmployee.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Alternate Phone">
              {selectedEmployee.alternate_phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              {selectedEmployee.role}
            </Descriptions.Item>
            <Descriptions.Item label="Designation">
              {selectedEmployee.designation}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {selectedEmployee.department}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {formatDate(selectedEmployee.dob)}
            </Descriptions.Item>
            <Descriptions.Item label="Joining Date">
              {formatDate(selectedEmployee.joining_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Probation End Date">
              {formatDate(selectedEmployee.probation_end_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Training End Date">
              {formatDate(selectedEmployee.training_end_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Increment Date">
              {formatDate(selectedEmployee.increment_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Anniversary Date">
              {formatDate(selectedEmployee.anniversary_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {selectedEmployee.address}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Group">
              {selectedEmployee.blood_group || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedEmployee.status}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeList;
