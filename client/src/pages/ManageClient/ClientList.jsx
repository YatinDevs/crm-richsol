import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("api/v1/emp/get-employee");
      console.log(response);
      setEmployees(response.data);
    } catch (error) {
      message.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

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
        <Link to={`/dashboard/employees/edit/${record.id}`}>
          <Button type="link">Edit</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="add-employee-container mt-10 p-10">
      <h2 className="text-center p-2 m-2 font-bold"> Employee List</h2>
      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default EmployeeList;
