// clientController.js
const { Client, Sale, Invoice } = require("../models/associations");
const bcrypt = require("bcryptjs");

// Create a new client

exports.createClient = async (req, res) => {
  try {
    console.log(req.body);

    const {
      company_name,
      address,
      owner_name,
      owner_phone,
      coordinator_name,
      coordinator_phone,
      gst_number,
      purchased_products,
      email,
      password,
      panel_name,
      service_type,
      recharge_date,
      validity_expire_date,
      last_recharge_date,
      notes,
      priority_level,
    } = req.body;

    // Check if required fields are present
    if (!company_name || !email || !password || !owner_phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the email already exists
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res
        .status(409)
        .json({ error: "Client with this email already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Onboarded by employee ID (Ensure req.employee exists)
    const onboardedBy = req.employee?.id || null;

    // Create the client
    const client = await Client.create({
      company_name,
      address,
      owner_name,
      owner_phone,
      coordinator_name,
      coordinator_phone,
      gst_number,
      purchased_products,
      email,
      password: hashedPassword, // Store hashed password
      panel_name,
      service_type,
      recharge_date,
      validity_expire_date,
      last_recharge_date,
      onboarded_by: onboardedBy,
      notes,
      priority_level,
    });

    // Respond with success (excluding sensitive data)
    res.status(201).json({
      success: true,
      message: "Client onboarded successfully",
      client: {
        id: client.id,
        company_name: client.company_name,
        email: client.email,
        service_type: client.service_type,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all clients (with optional status filter)
exports.getAllClients = async (req, res) => {
  try {
    const { status } = req.query; // Optional query parameter to filter by status

    const whereClause = status ? { status } : {}; // Filter by status if provided

    const clients = await Client.findAll({ where: whereClause });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    console.log(req.body, req.params);
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json({
      success: true,
      message: "Client Retrieved successfully",
      client: client,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_name,
      address,
      owner_name,
      owner_phone,
      coordinator_name,
      coordinator_phone,
      gst_number,
      purchased_products,
      email,
      password,
      panel_name,
      service_type,
      recharge_date,
      validity_expire_date,
      last_recharge_date,
      notes,
      priority_level,
    } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    await client.update({
      company_name,
      address,
      owner_name,
      owner_phone,
      coordinator_name,
      coordinator_phone,
      gst_number,
      purchased_products,
      email,
      panel_name,
      service_type,
      recharge_date,
      validity_expire_date,
      last_recharge_date,
      notes,
      priority_level,
    });

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate a client (set status to "inactive")
exports.deactivateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    await client.update({ status: "inactive" });
    res
      .status(200)
      .json({ success: true, message: "Client deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate a client (set status to "inactive")
exports.activateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    await client.update({ status: "active" });
    res
      .status(200)
      .json({ success: true, message: "Client activated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales for a specific client
exports.getClientSales = async (req, res) => {
  try {
    console.log("here", req.body, req.params);
    const { id } = req.params; // Get client ID from request params

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const sales = await Sale.findAll({
      where: { client_id: id },
      include: [
        {
          model: Client,
          as: "client",
        },
      ],
    });
    console.log(client, sales);

    res.status(200).json({
      success: true,
      message: "Client Purchase Data Retrieved successfully",
      clientPurchases: sales,
    });
  } catch (error) {
    console.error("Error fetching client sales:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all invoices for a specific client
exports.getClientInvoices = async (req, res) => {
  try {
    const { id } = req.params; // Get client ID from request params

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const invoices = await Invoice.findAll({
      where: { client_id: id },
      include: [
        {
          model: Sale,
          as: "sale",
        },
        {
          model: Client,
          as: "client",
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Client Invoices Data Retrieved successfully",
      clientInvoices: invoices,
    });
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
