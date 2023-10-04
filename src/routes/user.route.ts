import * as userController from "src/controllers/user.controller";
import express from "express";
import validate from "src/middleware/validate";
import { userAuthValidations } from "src/validations";

const router = express.Router();

router.post("/login", [
  validate(userAuthValidations.userLogin),
  userController.userLogin,
]);

router.post("/register", [
  validate(userAuthValidations.userRegister),
  userController.userRegister,
]);

router.post("/reset-password", [
  validate(userAuthValidations.resetPassword),
  userController.resetPassword,
]);

export default router;
