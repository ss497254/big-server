import express from "express";
import * as chatsController from "src/controllers/chats.controller";
import { authenticate } from "src/middleware/authenticate";
import validate from "src/middleware/validate";
import { chatsValidations } from "src/validations";

const router = express.Router();

router.use(authenticate());

router.get("/channels", chatsController.getChannels);

router.get("/channels/:channel/users", [
  validate(chatsValidations.getUserOfChannel),
  chatsController.getUserOfChannel,
]);

router.get("/channels/:channel/messages", [
  validate(chatsValidations.getMessages),
  chatsController.getMessages,
]);

router.post("/channels/:channel/message", [
  validate(chatsValidations.sendMessage),
  chatsController.sendMessage,
]);

router.patch("/channels/:channel/message", [
  validate(chatsValidations.editMessage),
  chatsController.editMessage,
]);

export default router;
