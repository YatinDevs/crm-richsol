import { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Steps,
  Row,
  Col,
} from "antd";
import axiosInstance from "../../services/api";
import dayjs from "dayjs";

const { Step } = Steps;
const { Option } = Select;

const AddEmployee = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const response = await axiosInstance.get("/emp/search-employee", {
        params: { search },
      });
      setEmployees(response?.data?.employees || []);
      setDropdownVisible(true);
    } catch (err) {
      message.error("Error searching employees");
    }
  };

  const handleSelectEmployee = (employee) => {
    form.setFieldsValue({
      username: employee.username,
      email: employee.email,
      phone: employee.phone,
      alternate_phone: employee.alternate_phone || "",
      designation: employee.designation || "",
      department: employee.department || "",
      dob: employee.dob ? dayjs(employee.dob) : null,
      joining_date: employee.joining_date ? dayjs(employee.joining_date) : null,
      probation_end_date: employee.probation_end_date
        ? dayjs(employee.probation_end_date)
        : null,
      training_end_date: employee.training_end_date
        ? dayjs(employee.training_end_date)
        : null,
      increment_date: employee.increment_date
        ? dayjs(employee.increment_date)
        : null,
      anniversary_date: employee.anniversary_date
        ? dayjs(employee.anniversary_date)
        : null,
      address: employee.address || "",
      state: employee.state || "",
      country: employee.country || "",
      pincode: employee.pincode || "",
      blood_group: employee.blood_group || "",
      status: employee.status || "active",
    });

    setDropdownVisible(false);
  };

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Search Employees</h2>
        <div className="relative flex justify-center items-center gap-2">
          <Input
            type="text"
            placeholder="Search by name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
        {dropdownVisible && (
          <ul className="absolute w-full md:w-1/2 bg-white shadow-lg rounded mt-2">
            {employees.map((emp) => (
              <li
                key={emp.id}
                className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectEmployee(emp)}
              >
                {emp.username} - {emp.email} - {emp.phone}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
        <Steps current={currentStep}>
          <Step title="Employee Details" onClick={() => setCurrentStep(0)} />
          <Step title="Work Details" onClick={() => setCurrentStep(1)} />
          <Step title="KYC & Attachments" onClick={() => setCurrentStep(2)} />
        </Steps>

        <Form form={form} layout="vertical" className="mt-6">
          {currentStep === 0 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: "Username is required" }]}
                >
                  <Input placeholder="Enter username" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Valid email is required",
                    },
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: "Phone number is required" },
                  ]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
                <Form.Item name="alternate_phone" label="Alternate Phone">
                  <Input placeholder="Enter alternate phone" />
                </Form.Item>
                <Form.Item name="dob" label="Date of Birth">
                  <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input.TextArea placeholder="Enter address" />
                </Form.Item>
                <Form.Item name="state" label="State">
                  <Input placeholder="Enter state" />
                </Form.Item>
                <Form.Item name="country" label="Country">
                  <Input placeholder="Enter country" />
                </Form.Item>
                <Form.Item name="pincode" label="Pincode">
                  <Input placeholder="Enter pincode" />
                </Form.Item>
                <Form.Item name="blood_group" label="Blood Group">
                  <Input placeholder="Enter blood group" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {currentStep === 1 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="designation"
                  label="Designation"
                  rules={[
                    { required: true, message: "Designation is required" },
                  ]}
                >
                  <Input placeholder="Enter designation" />
                </Form.Item>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[
                    { required: true, message: "Department is required" },
                  ]}
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
                <Form.Item name="joining_date" label="Joining Date">
                  <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>
                <Form.Item name="probation_end_date" label="Probation End Date">
                  <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>
                <Form.Item name="training_end_date" label="Training End Date">
                  <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>
                <Form.Item name="increment_date" label="Increment Date">
                  <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>
                <Form.Item name="anniversary_date" label="Anniversary Date">
                  <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>
                <Form.Item name="status" label="Status">
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          {currentStep === 2 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="attachments" label="Upload Documents">
                  <Input type="file" multiple />
                </Form.Item>
              </Col>
            </Row>
          )}

          <div className="flex justify-between mt-4">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            {currentStep < 2 && (
              <Button
                type="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddEmployee;
