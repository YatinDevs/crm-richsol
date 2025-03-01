import { useState } from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Upload,
  Steps,
  Row,
  Col,
} from "antd";
import axiosInstance from "../../services/api";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineLock,
  AiOutlineUpload,
} from "react-icons/ai";
import { UploadOutlined } from "@ant-design/icons";
import countryStateData from "../../constants/countryState.json"; // Assume a JSON file with country-state mapping.

const { Step } = Steps;
const { Option } = Select;

const AddEmployee = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [states, setStates] = useState([]);

  // Handle country change
  const handleCountryChange = (value) => {
    const selectedCountryStates = countryStateData[value] || [];
    setStates(selectedCountryStates);
  };

  // Handle file upload
  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  // Handle navigation between steps
  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  // Submit the form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };

      // Format date fields
      Object.keys(finalData).forEach((key) => {
        if (finalData[key] instanceof dayjs) {
          finalData[key] = finalData[key].format("YYYY-MM-DD");
        }
      });

      // Create FormData object
      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(finalData).forEach((key) => {
        formDataToSend.append(key, finalData[key]);
      });

      // Append uploaded files
      fileList.forEach((file) => {
        formDataToSend.append("attachments", file.originFileObj);
      });

      const response = await axiosInstance.post(
        "/emp/create-employee",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        message.success("Employee onboarded successfully");
        form.resetFields();
        setFormData({});
        setFileList([]);
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Failed to add employee");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <EmployeeSearch></EmployeeSearch>
      <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
        <Steps current={currentStep} progressDot>
          <Step
            title="Employee Details"
            icon={<AiOutlineUser />}
            onClick={() => setCurrentStep(0)}
          />
          <Step
            title="Work Details"
            icon={<AiOutlineSolution />}
            onClick={() => setCurrentStep(1)}
          />
          <Step
            title="Credentials & Attachments"
            icon={<AiOutlineLock />}
            onClick={() => setCurrentStep(2)}
          />
        </Steps>

        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
          className="mt-6"
        >
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
                      message: "Enter a valid email",
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
              </Col>
              <Col span={12}>
                <Form.Item name="dob" label="Date of Birth">
                  <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item name="blood_group" label="Blood Group">
                  <Input placeholder="Enter blood group" />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input.TextArea rows={2} placeholder="Enter address" />
                </Form.Item>
                <Form.Item name="country" label="Country">
                  <Select
                    placeholder="Select country"
                    onChange={handleCountryChange}
                  >
                    {Object.keys(countryStateData).map((country) => (
                      <Option key={country} value={country}>
                        {country}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="state" label="State">
                  <Select placeholder="Select state">
                    {states.map((state) => (
                      <Option key={state} value={state}>
                        {state}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="pincode" label="Pincode">
                  <Input placeholder="Enter pincode" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item
                name="designation"
                label="Designation"
                rules={[{ required: true, message: "Designation is required" }]}
              >
                <Input placeholder="Enter designation" />
              </Form.Item>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: "Please select a department" },
                ]}
              >
                <Select placeholder="Select department">
                  <Option value="Development Team">Development Team</Option>
                  <Option value="HR Team">HR Team</Option>
                  <Option value="Marketing Team">Marketing Team</Option>
                  <Option value="Sales Team">Sales Team</Option>
                  <Option value="Support Team">Support Team</Option>
                </Select>
              </Form.Item>{" "}
              <Form.Item
                name="joining_date"
                label="Joining Date"
                rules={[
                  { required: true, message: "Joining date is required" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                name="probation_end_date"
                label="Probation End Date"
                rules={[
                  { required: true, message: "Probation end date is required" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item name="training_end_date" label="Training End Date">
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item name="increment_date" label="Increment Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <>
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
                  <Option value="tech">Tech</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
              <Form.Item name="attachments" label="Attachments">
                <Upload
                  multiple
                  beforeUpload={() => false}
                  onChange={handleUpload}
                  fileList={fileList}
                >
                  <Button icon={<UploadOutlined />}>Upload Files</Button>
                </Upload>
              </Form.Item>
            </>
          )}

          <div className="mt-6 flex justify-between">
            {currentStep > 0 && <Button onClick={handlePrev}>Back</Button>}
            {currentStep < 2 ? (
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddEmployee;

const EmployeeSearch = () => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    console.log(search);
    if (!search.trim()) {
      setError("Search query cannot be empty");
      return;
    }

    try {
      setError("");
      const response = await axiosInstance.get(
        `/search-employee?search=${search}`,
        { withCredentials: true }
      );
      setEmployees(response.data.employees);
    } catch (err) {
      setError("Error searching employees");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Search Employees</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4">
        {employees.length > 0 ? (
          <ul className="border rounded p-2">
            {employees.map((emp) => (
              <li key={emp.id} className="p-2 border-b">
                <strong>{emp.username}</strong> - {emp.phone}
              </li>
            ))}
          </ul>
        ) : (
          <p>No employees found</p>
        )}
      </div>
    </div>
  );
};
