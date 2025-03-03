import React, { useState, useEffect } from "react";
import { Table, Button, message, Modal, Descriptions, Tabs } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const priorityLevels = ["Normal", "High", "Critical"];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get("/client/get-clients");
      console.log(response);
      setClients(response.data.clientDetails);
    } catch (error) {
      message.error("Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    try {
      await axiosInstance.post(`/client/delete-client/${id}`, {
        status: "inactive",
      });
      message.success("Client status updated to inactive.");
      fetchClients();
    } catch (error) {
      message.error("Failed to update client status.");
    }
  };

  const showModal = (client) => {
    setSelectedClient(client);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: "Company Name", dataIndex: "company_name", key: "company_name" },
    { title: "Owner Name", dataIndex: "owner_name", key: "owner_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Priority", dataIndex: "priority_level", key: "priority_level" },
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
            onClick={() =>
              navigate(`/dashboard/clients/edit/${record.client_id}`)
            }
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteClient(record.client_id)}
            danger
          />
        </>
      ),
    },
  ];

  return (
    <ContentWrapper>
      <div className="add-client-container mt-5 px-10 py-5">
        <h2 className="text-center bg-white rounded-2xl p-2 m-2 font-semibold uppercase text-gray-800">
          Client List
        </h2>
        <Tabs>
          {priorityLevels.map((level) => (
            <Tabs.TabPane tab={level} key={level}>
              <h3 className="font-semibold">Active Clients</h3>
              <Table
                columns={columns}
                dataSource={clients.filter(
                  (client) =>
                    client.priority_level === level &&
                    client.status === "active"
                )}
                loading={loading}
                rowKey="client_id"
              />
              <h3 className="font-semibold mt-6">Inactive Clients</h3>
              <Table
                columns={columns}
                dataSource={clients.filter(
                  (client) =>
                    client.priority_level === level &&
                    client.status === "inactive"
                )}
                loading={loading}
                rowKey="client_id"
              />
            </Tabs.TabPane>
          ))}
        </Tabs>

        <Modal
          title="Client Details"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          {selectedClient && (
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Company Name">
                {selectedClient.company_name}
              </Descriptions.Item>
              <Descriptions.Item label="Owner Name">
                {selectedClient.owner_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedClient.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedClient.owner_phone}
              </Descriptions.Item>
              <Descriptions.Item label="Priority Level">
                {selectedClient.priority_level}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedClient.status}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </ContentWrapper>
  );
};

export default ClientList;
