import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message,
  Modal,
} from "antd";
import axios from "axios";
import moment from "moment";

const ManageAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get("/api/attendance"); // Adjust your API endpoint
      setAttendanceData(response.data.attendance);
    } catch (error) {
      message.error("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = () => {
    setIsModalVisible(true);
    setSelectedAttendance(null); // Reset any selected record
  };

  const handleEditAttendance = (attendance) => {
    setSelectedAttendance(attendance);
    setIsModalVisible(true);
  };

  const handleDeleteAttendance = async (attendanceId) => {
    try {
      await axios.delete(`/api/attendance/${attendanceId}`); // Adjust your API endpoint
      message.success("Attendance record deleted successfully.");
      fetchAttendance();
    } catch (error) {
      message.error("Failed to delete attendance record.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const { employee_id, date, status, check_in, check_out } = values;
      if (selectedAttendance) {
        // Update attendance record
        await axios.put(`/api/attendance/${selectedAttendance.attendance_id}`, {
          employee_id,
          date,
          status,
          check_in: check_in ? check_in.format("HH:mm:ss") : null,
          check_out: check_out ? check_out.format("HH:mm:ss") : null,
        });
        message.success("Attendance updated successfully.");
      } else {
        // Create new attendance record
        await axios.post("/api/attendance", {
          employee_id,
          date,
          status,
          check_in: check_in ? check_in.format("HH:mm:ss") : null,
          check_out: check_out ? check_out.format("HH:mm:ss") : null,
        });
        message.success("Attendance added successfully.");
      }
      fetchAttendance(); // Refresh attendance list
      setIsModalVisible(false); // Close the modal
    } catch (error) {
      message.error("Failed to submit attendance.");
    }
  };

  const columns = [
    {
      title: "Employee",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Check-in",
      dataIndex: "check_in",
      key: "check_in",
    },
    {
      title: "Check-out",
      dataIndex: "check_out",
      key: "check_out",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEditAttendance(record)} type="link">
            Edit
          </Button>
          <Button
            onClick={() => handleDeleteAttendance(record.attendance_id)}
            type="link"
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Manage Attendance</h2>
      <Button
        type="primary"
        onClick={handleAddAttendance}
        style={{ marginBottom: 16 }}
      >
        Add Attendance
      </Button>
      <Table
        columns={columns}
        dataSource={attendanceData}
        loading={loading}
        rowKey="attendance_id"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={selectedAttendance ? "Edit Attendance" : "Add Attendance"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={selectedAttendance}
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
              defaultValue={selectedAttendance?.employee_id}
            >
              {/* Replace with actual employee data */}
              <Select.Option value={1}>John Doe</Select.Option>
              <Select.Option value={2}>Jane Smith</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker
              format="YYYY-MM-DD"
              defaultValue={
                selectedAttendance ? moment(selectedAttendance.date) : null
              }
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              placeholder="Select status"
              defaultValue={selectedAttendance?.status}
            >
              <Select.Option value="present">Present</Select.Option>
              <Select.Option value="absent">Absent</Select.Option>
              <Select.Option value="leave">Leave</Select.Option>
            </Select>
          </Form.Item>

          {(selectedAttendance?.status === "present" ||
            !selectedAttendance) && (
            <>
              <Form.Item
                name="check_in"
                label="Check-in"
                rules={[{ required: true }]}
              >
                <TimePicker
                  defaultValue={
                    selectedAttendance
                      ? moment(selectedAttendance.check_in, "HH:mm:ss")
                      : null
                  }
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item name="check_out" label="Check-out">
                <TimePicker
                  defaultValue={
                    selectedAttendance
                      ? moment(selectedAttendance.check_out, "HH:mm:ss")
                      : null
                  }
                  format="HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </>
          )}

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

export default ManageAttendance;
