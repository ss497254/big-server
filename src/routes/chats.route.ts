import express from "express";
import * as chatsController from "src/controllers/chats.controller";
import { authenticate } from "src/middleware/authenticate";
import validate from "src/middleware/validate";
import { chatsValidations } from "src/validations";

const router = express.Router();

router.use(authenticate());

router.get("/channels", chatsController.getChannels);

router.get("/messages", [
  validate(chatsValidations.getMessages),
  chatsController.getMessages,
]);

router.post("/send-message", [
  validate(chatsValidations.sendMessage),
  chatsController.sendMessage,
]);

export default router;
