const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const bcrypt = require("bcryptjs");

const Service = sequelize.define(
  "Service",
  {
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_name: {
      type: DataTypes.ENUM(
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
        "Others"
      ), // sales step 1 // list by sanika
      allowNull: false,
    },
    service_type: {
      type: DataTypes.ENUM("GST", "Non-GST"),
      allowNull: false, // sales step 2
    },
    sub_service_name: {
      type: DataTypes.ENUM(
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
        "Email Panel"
      ),
      allowNull: true,
    },
    panel_url: {
      type: DataTypes.ENUM(
        "https://smsjust.com/blank/login.php",
        "https://www.ucc-bsnl.co.in/",
        "https://smartping.live/entity/home",
        "https://www.airtel.in/business/commercial-communication/home",
        "https://trueconnect.jio.com/#/",
        "https://www.vilpower.in/",
        "https://fastsms.bulkwhatsapp.net/login.php",
        "https://message.richsol.com/user/send-whatsapp",
        "https://wapp.digitalsms.biz/signin.php",
        "http://app.infobynitin.com",
        "http://135.181.223.161/login?logSucc=true",
        "http://103.255.103.28/login.php?m_l=true",
        "https://cp.richsol.com/alogin"
      ),
      allowNull: true,
    },
    recharge_date: {
      type: DataTypes.DATE, // sales step 2
      allowNull: true,
    },
    validity_expire_date: {
      type: DataTypes.DATE, // sales step 2
      allowNull: true,
    },
    last_recharge_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false, // sales step 2
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false, // sales step 2
    },
    description: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.FLOAT, // sales step 3
      allowNull: false,
    },
    gst_value: {
      type: DataTypes.FLOAT, // sales step 3
    },
    total_amount: {
      type: DataTypes.FLOAT, // sales step 3
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false, // sales step 2
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "services",
    timestamps: true,
  }
);

module.exports = Service;
