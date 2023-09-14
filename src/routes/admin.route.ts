import express from "express";
import * as chatsController from "src/controllers/chats.controller";
import * as adminContoller from "src/controllers/admin.controller";
import { authenticate } from "src/middleware/authenticate";
import validate from "src/middleware/validate";
import { chatsValidations } from "src/validations";

const router = express.Router();

router.use(authenticate({ admin: true }));

router.get("/health-status", adminContoller.getHealthStatus);

router.get("/active-clients", adminContoller.getActiveClients);

router.post("/create-channel", [
  validate(chatsValidations.createChannel),
  chatsController.createChannel,
]);

export default router;
