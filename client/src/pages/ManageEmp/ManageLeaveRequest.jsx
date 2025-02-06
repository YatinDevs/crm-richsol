import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Modal,
} from "antd";
import axios from "axios";
import moment from "moment";

const ManageLeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get("/api/leave-requests"); // Adjust your API endpoint
      setLeaveData(response.data.leaveRequests);
    } catch (error) {
      message.error("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeaveRequest = () => {
    setIsModalVisible(true);
    setSelectedLeave(null); // Reset any selected record
  };

  const handleEditLeaveRequest = (leave) => {
    setSelectedLeave(leave);
    setIsModalVisible(true);
  };

  const handleDeleteLeaveRequest = async (leaveId) => {
    try {
      await axios.delete(`/api/leave-requests/${leaveId}`); // Adjust your API endpoint
      message.success("Leave request deleted successfully.");
      fetchLeaveRequests();
    } catch (error) {
      message.error("Failed to delete leave request.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const { employee_id, leave_type, start_date, end_date, reason, status } =
        values;
      if (selectedLeave) {
        // Update leave request
        await axios.put(`/api/leave-requests/${selectedLeave.leave_id}`, {
          employee_id,
          leave_type,
          start_date,
          end_date,
          reason,
          status,
        });
        message.success("Leave request updated successfully.");
      } else {
        // Create new leave request
        await axios.post("/api/leave-requests", {
          employee_id,
          leave_type,
          start_date,
          end_date,
          reason,
        });
        message.success("Leave request added successfully.");
      }
      fetchLeaveRequests(); // Refresh leave request list
      setIsModalVisible(false); // Close the modal
    } catch (error) {
      message.error("Failed to submit leave request.");
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await axios.put(`/api/leave-requests/${leaveId}/approve`); // Adjust your API endpoint
      message.success("Leave request approved.");
      fetchLeaveRequests();
    } catch (error) {
      message.error("Failed to approve leave request.");
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      await axios.put(`/api/leave-requests/${leaveId}/reject`); // Adjust your API endpoint
      message.success("Leave request rejected.");
      fetchLeaveRequests();
    } catch (error) {
      message.error("Failed to reject leave request.");
    }
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      key: "leave_type",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEditLeaveRequest(record)} type="link">
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteLeaveRequest(record.leave_id)}
            type="link"
            danger
          >
            Delete
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                onClick={() => handleApproveLeave(record.leave_id)}
                type="link"
                style={{ color: "green" }}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleRejectLeave(record.leave_id)}
                type="link"
                style={{ color: "red" }}
              >
                Reject
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Manage Leave Requests</h2>
      <Button
        type="primary"
        onClick={handleAddLeaveRequest}
        style={{ marginBottom: 16 }}
      >
        Add Leave Request
      </Button>
      <Table
        columns={columns}
        dataSource={leaveData}
        loading={loading}
        rowKey="leave_id"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={selectedLeave ? "Edit Leave Request" : "Add Leave Request"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={selectedLeave}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="employee_id"
            label="Employee"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select an employee"
              defaultValue={selectedLeave?.employee_id}
            >
              {/* Replace with actual employee data */}
              <Select.Option value={1}>John Doe</Select.Option>
              <Select.Option value={2}>Jane Smith</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="leave_type"
            label="Leave Type"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select leave type"
              defaultValue={selectedLeave?.leave_type}
            >
              <Select.Option value="sick">Sick</Select.Option>
              <Select.Option value="casual">Casual</Select.Option>
              <Select.Option value="earned">Earned</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              defaultValue={
                selectedLeave ? moment(selectedLeave.start_date) : null
              }
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              defaultValue={
                selectedLeave ? moment(selectedLeave.end_date) : null
              }
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="reason" label="Reason">
            <Input.TextArea
              rows={4}
              defaultValue={selectedLeave?.reason}
              placeholder="Enter reason for leave"
            />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              placeholder="Select status"
              defaultValue={selectedLeave?.status}
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageLeaveRequest;
