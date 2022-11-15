const express = require("express");
const router = express.Router();
const employeecontrollers = require("../../controllers/employees");
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require("../../middlewares/verifyRoles");
router
  .route("/")
  .get(employeecontrollers.getEmployees)
  .put( verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeecontrollers.updateEmployee)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeecontrollers.createEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), employeecontrollers.deleteEmployee);

router.route("/:id").get(employeecontrollers.getEmployee);

module.exports = router;
 