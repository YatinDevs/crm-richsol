// clientController.js
const { Client, Sale, Invoice } = require("../models");

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    await client.update(req.body);
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    await client.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get sales for a client
exports.getClientSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({ where: { client_id: req.params.id } });
    res.status(200).json(sales);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get invoices for a client
exports.getClientInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { client_id: req.params.id },
    });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
