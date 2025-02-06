const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, employee) => {
    if (err) return res.status(402).json({ error: "Invalid or expired token" });
    req.employee = employee;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.employee.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
