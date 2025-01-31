require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan"); // logger
const { sequelize } = require("./models"); // Import sequelize and all models

// Required Dependencies

// Models setup
// const User = require("./models/userModel");
const Employee = require("./models/employeeModel");
const Token = require("./models/tokenModel");
const models = { Employee, Token };

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});
const app = express();

// CORS policy
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "*"],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json()); // body parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //
app.get("/dev", (req, res) => {
  res.send("Website Template App");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/emp", employeeRoutes);

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
