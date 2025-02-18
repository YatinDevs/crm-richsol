import { useState } from "react";
import dayjs from "dayjs";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Space,
  Steps,
} from "antd";
import axiosInstance from "../../services/api";
import {
  AiOutlineFileText,
  AiOutlineLink,
  AiOutlineDollar,
} from "react-icons/ai";
import { useLocation } from "react-router-dom";

const { Step } = Steps;
const { Option } = Select;

const serviceOptions = [
  "Bulk SMS",
  "Sim Base SMS",
  "WhatsApp Service",
  "WhatsApp Chatbot Service",
  "AI Chatbot Implementation",
  "Voice",
  "Email",
  "Business Lead Automation",
  "Digital Marketing",
  "Website Or Software Development",
];

const serviceTypeOptions = ["GST", "Non-GST"];

const subServiceOptions = [
  "SMS Just Panel",
  "DLT BSNL Panel",
  "DLT SmartPing Panel",
  "DLT Airtel Panel",
  "DLT Jio Panel",
  "DLT VI Panel",
  "Fast SMS Panel",
  "Personal Number Whatsapp Panel",
  "Virtual Number Whatsapp Panel",
  "Blue Verified Whatsapp Panel",
  "135 Panel",
  "Voice Panel",
  "Email Panel",
];

const panelUrls = {
  "SMS Just Panel": "https://smsjust.com/blank/login.php",
  "DLT BSNL Panel": "https://www.ucc-bsnl.co.in/",
  "DLT SmartPing Panel": "https://smartping.live/entity/home",
  "DLT Airtel Panel":
    "https://www.airtel.in/business/commercial-communication/home",
  "DLT Jio Panel": "https://trueconnect.jio.com/#/",
  "DLT VI Panel": "https://www.vilpower.in/",
  "Fast SMS Panel": "https://fastsms.bulkwhatsapp.net/login.php",
  "Personal Number Whatsapp Panel":
    "https://message.richsol.com/user/send-whatsapp",
  "Virtual Number Whatsapp Panel": "https://wapp.digitalsms.biz/signin.php",
  "Blue Verified Whatsapp Panel": "http://app.infobynitin.com",
  "135 Panel": "http://135.181.223.161/login?logSucc=true",
  "Voice Panel": "http://103.255.103.28/login.php?m_l=true",
  "Email Panel": "https://cp.richsol.com/alogin",
};

const AddServiceForm = () => {
  const location = useLocation();
  const { client } = location.state || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]); // store multiple clients
  const [searchClient, setSearchClient] = useState(null); // store selected client
  console.log(searchClient, `Selected Client`);
  console.log(clients, `Searched List`);
  console.log(formData, `Adding Service Data`);

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };

      // Format any dayjs dates to a proper string format
      Object.keys(finalData).forEach((key) => {
        if (finalData[key] instanceof dayjs) {
          finalData[key] = finalData[key].format("YYYY-MM-DD");
        }
      });

      // Determine client_id (either from state or selected client)
      const clientId = client?.client_id || searchClient?.client_id;

      if (!clientId) {
        message.error("Please select a client.");
        return;
      }

      const response = await axiosInstance.post("/service/add", finalData);

      if (response.data.success) {
        // Add sale record
        const saleData = {
          client_id: clientId,
          employee_id: values.sold_by, // assuming employee id is passed
          service_id: response.data.service_id,
          amount: values.price,
          gst_value: 0, // GST value calculation can be added here
          total_amount: values.price, // adjust if needed for GST or discounts
          payment_status: "pending", // or based on actual logic
          sale_date: dayjs().format("YYYY-MM-DD"),
        };

        await axiosInstance.post("/sale/add", saleData);

        message.success("Service and Sale added successfully");
        form.resetFields();
        setFormData({});
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Failed to add service");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleClientSearch = async (value) => {
    try {
      const response = await axiosInstance.get("/client/search", {
        params: { search: value },
      });
      if (response.data.success) {
        setClients(response.data.clients); // Store the list of clients
        console.log(response.data.clients);
      } else {
        setClients([]);
        message.error("No clients found.");
      }
    } catch (error) {
      console.error("Search Error:", error);
      message.error("Error searching for clients.");
    }
  };

  return (
    <div className="p-6 mx-2 mt-10 bg-white shadow-lg rounded-lg">
      <Steps current={currentStep}>
        <Step
          title="Service Details"
          icon={<AiOutlineFileText />}
          onClick={() => setCurrentStep(0)}
        />
        <Step
          title="Service Information"
          icon={<AiOutlineLink />}
          onClick={() => setCurrentStep(1)}
        />
        <Step
          title="Pricing and Submission"
          icon={<AiOutlineDollar />}
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
          <>
            {client ? (
              <p>Selected Client: {client.company_name}</p>
            ) : (
              <>
                <Form.Item
                  name="client_search"
                  label="Search for Client"
                  rules={[{ required: true, message: "Client is required" }]}
                >
                  <Input
                    placeholder="Search by email, phone, or name"
                    onChange={(e) => handleClientSearch(e.target.value)}
                  />
                </Form.Item>

                {clients.length > 0 && (
                  <Form.Item
                    name="client_id"
                    label="Select Client"
                    rules={[
                      { required: true, message: "Please select a client" },
                    ]}
                  >
                    <Select
                      placeholder="Select a client"
                      onChange={(value) => {
                        const selectedClient = clients.find(
                          (client) => client.client_id === value
                        );
                        setSearchClient(selectedClient);
                        setFormData({
                          ...formData,
                          client_id: selectedClient?.client_id,
                        });
                      }}
                    >
                      {clients.map((client) => (
                        <Option key={client.client_id} value={client.client_id}>
                          {client.company_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </>
            )}
            <Form.Item
              name="service_name"
              label="Service Name"
              rules={[{ required: true, message: "Service name is required" }]}
            >
              <Select placeholder="Select Service">
                {serviceOptions.map((service) => (
                  <Option key={service} value={service}>
                    {service}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="service_type"
              label="Service Type"
              rules={[{ required: true, message: "Service type is required" }]}
            >
              <Select placeholder="Select Service Type">
                {serviceTypeOptions.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="sub_service_name" label="Sub-Service">
              <Select placeholder="Select Sub-Service (Optional)">
                {subServiceOptions.map((subService) => (
                  <Option key={subService} value={subService}>
                    {subService}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item name="panel_url" label="Panel URL">
              <Select placeholder="Select Panel URL (Optional)">
                {Object.keys(panelUrls).map((panel) => (
                  <Option key={panel} value={panelUrls[panel]}>
                    {panel}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea placeholder="Enter description" />
            </Form.Item>
            <Form.Item name="recharge_date" label="Recharge Date">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="sold_by" label="Sold By">
              <Input placeholder="Employee Name" />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Form.Item name="price" label="Price">
              <Input type="number" placeholder="Price" />
            </Form.Item>
            <Form.Item name="gst_value" label="GST (Optional)">
              <Input type="number" placeholder="GST Value" />
            </Form.Item>
          </>
        )}

        <Space>
          {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
          {currentStep < 2 ? (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Space>
      </Form>
    </div>
  );
};

export default AddServiceForm;
