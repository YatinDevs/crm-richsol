// clientController.js
const { Client, Sale, Invoice } = require("../models/associations");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Utility function to remove sensitive fields
const sanitizeClient = (client) => {
  if (!client) return null;
  const clientData = client.toJSON();
  delete clientData.password;
  return clientData;
};

exports.searchClient = async (req, res) => {
  const { search } = req.query;

  // Log the search query for debugging
  console.log("Search Query:", search);

  // Validate that search query is not empty
  if (!search) {
    return res
      .status(400)
      .json({ success: false, message: "Search query cannot be empty" });
  }

  try {
    // Perform the search query on the Client model
    const clients = await Client.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { owner_phone: { [Op.like]: `%${search}%` } },
          { company_name: { [Op.like]: `%${search}%` } },
        ],
      },
      // Optionally log the generated SQL query for debugging
      logging: console.log,
    });
    console.log(clients);
    // Return the results
    res.json({
      success: true,
      clients: clients,
      message: "Retrieved Matching List",
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error searching client:", error);

    // Send an error response
    res.status(500).json({ success: false, message: "Error searching client" });
  }
};
exports.createClient = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

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

    // Validate required fields
    if (!company_name || !email || !password || !owner_phone || !service_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate GST Number format (Optional: Update regex if needed)
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gst_number && !gstRegex.test(gst_number)) {
      return res.status(400).json({ error: "Invalid GST number format" });
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
      address: address || null,
      owner_name,
      owner_phone,
      coordinator_name: coordinator_name || null,
      coordinator_phone: coordinator_phone || null,
      gst_number: gst_number || null,
      purchased_products: purchased_products || null,
      email,
      password: hashedPassword, // Store hashed password
      panel_name: panel_name || null,
      service_type,
      recharge_date: recharge_date || null,
      validity_expire_date: validity_expire_date || null,
      last_recharge_date: last_recharge_date || null,
      onboarded_by: onboardedBy,
      notes: notes || null,
      priority_level: priority_level || "Normal",
    });
    const clientDetails = sanitizeClient(client);
    // Respond with success (excluding sensitive data)
    res.status(201).json({
      success: true,
      message: "Client onboarded successfully",
      client: clientDetails,
    });
  } catch (error) {
    console.error("Error creating client:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// **Get All Clients**
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      attributes: { exclude: ["password"] },
    });
    const clientDetails = sanitizeClient(clients);

    res.json({
      success: true,
      message: "Client listed successfully",
      clients: clientDetails,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// **Get Single Client by ID**
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { client_id: req.params.id },
      attributes: { exclude: ["password"] },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    const clientDetails = sanitizeClient(client);

    res.json({
      success: true,
      message: "Client Retrieved successfully",
      client: clientDetails,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
    const clientDetails = sanitizeClient(client);

    res.status(200).json({
      success: true,
      message: "Client Updated successfully",
      client: clientDetails,
    });
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
