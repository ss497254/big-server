import * as adminController from "src/controllers/admin.controller";
import express from "express";
import validate from "src/middleware/validate";
import { adminAuthValidations } from "src/validations";

const router = express.Router();

router
  .route("/admin/login")
  .post(validate(adminAuthValidations.adminLogin, adminController.adminLogin));

export default router;
