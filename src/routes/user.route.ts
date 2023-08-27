import * as userController from "src/controllers/user.controller";
import express from "express";
import validate from "src/middleware/validate";
import { userAuthValidations } from "src/validations";

const router = express.Router();

router
  .route("/login")
  .post(validate(userAuthValidations.userLogin, userController.userLogin));

export default router;
