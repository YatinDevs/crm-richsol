import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Descriptions, Tabs } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const departments = [
    "Development Team",
    "HR Team",
    "Marketing Team",
    "Interns",
    "Sales Team",
    "Support Team",
  ];

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
      await axiosInstance.post(`/emp/delete-employee/${id}`, {
        status: "inactive",
      });
      message.success("Employee status updated to inactive.");
      fetchEmployees();
    } catch (error) {
      message.error("Failed to update employee status.");
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
    date ? moment(date).format("DD MMM YYYY") : "N/A";

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/dashboard/employees/edit/${record.id}`)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteEmployee(record.id)}
            danger
          />
        </>
      ),
    },
  ];

  return (
    <ContentWrapper>
      <div className="add-employee-container mt-5 px-10 py-5">
        <h2 className="text-center bg-white rounded-2xl p-2 m-2 font-semibold uppercase text-gray-800">
          Employee List
        </h2>
        <Tabs>
          {departments.map((dept) => (
            <Tabs.TabPane tab={dept} key={dept}>
              <h3 className="font-semibold">Active Employees</h3>
              <Table
                columns={columns}
                dataSource={employees.filter(
                  (emp) => emp.department === dept && emp.status === "active"
                )}
                loading={loading}
                rowKey="id"
              />
              <h3 className="font-semibold mt-6">Inactive Employees</h3>
              <Table
                columns={columns}
                dataSource={employees.filter(
                  (emp) => emp.department === dept && emp.status === "inactive"
                )}
                loading={loading}
                rowKey="id"
              />
            </Tabs.TabPane>
          ))}
        </Tabs>

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
              <Descriptions.Item label="Role">
                {selectedEmployee.role}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedEmployee.department}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedEmployee.status}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </ContentWrapper>
  );
};

export default EmployeeList;
