require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan"); // logger
// Required Dependencies

// db setup
const sequelize = require("./utils/db");
// Models setup
const {
  Employee,
  Client,
  Service,
  Sale,
  Invoice,
  Task,
} = require("./models/associations");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
// const taskRoutes = require("./routes/taskRoutes");

const app = express();

// CORS policy
const corsOptions = {
  origin: [
    "http://192.168.0.241:5173",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions)); // Handle all routes CORS at once
app.use(morgan("dev"));
app.use(express.json()); // body parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //
app.get("/dev", (req, res) => {
  res.send("Website Template App");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/emp", employeeRoutes);
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/invoice", invoiceRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
    return sequelize.sync();
  })
  .then(() => {
    console.log("Models have been synchronized with the database.");

    const PORT = process.env.NODE_DOCKER_PORT || process.env.NODE_LOCAL_PORT;

    app.listen(PORT, () => {
      console.log(`Server is Running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
