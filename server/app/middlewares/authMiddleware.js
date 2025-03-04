const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const token = req.cookies.accessToken; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, employee) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.employee = employee; // Attach decoded user to request
    console.log("Verified employee:", req.employee.id);
    next(); // Proceed to next middleware/controller
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.employee.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
