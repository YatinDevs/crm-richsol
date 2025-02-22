const express = require("express");
const employeeController = require("../controllers/employeeController");
const { authenticate } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

// admin can be registered through postman -------> checked
// admin can login through auth login point -------> checked
// admin can create employee -------> checked
// admin can create employee and has authenticate access or not -------> checked
// admin or Hr can create employee  -------> checked
router.post(
  "/create-employee",
  authenticate,
  checkRole(["admin", "hr"]),
  upload.array("attachments", 5),
  employeeController.createEmployee
);

router.get(
  "/get-employee",
  authenticate,
  checkRole(["admin", "hr"]),
  employeeController.getAllEmployee
);

router.get("/employees/:id", employeeController.getEmployeeById);
router.put("/update-employee/:id", employeeController.updateEmployee);
router.post(
  "/delete-employee/:id",
  authenticate,
  checkRole(["admin", "hr"]),
  employeeController.deactivateEmployee
);

// Additional routes
router.get("/employees/:id/tasks", employeeController.getEmployeeTasks);
router.get(
  "/employees/:id/attendance",
  employeeController.getEmployeeAttendance
);
router.get(
  "/employees/:id/leave-requests",
  employeeController.getEmployeeLeaveRequests
);

module.exports = router;
