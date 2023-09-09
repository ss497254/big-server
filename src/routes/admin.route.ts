import express from "express";
import * as healthContoller from "src/controllers/health.controller";
import { authenticate } from "src/middleware/authenticate";

const router = express.Router();

router.use(authenticate({ admin: true }));

router.get("/health-status", healthContoller.getHealthStatus);

export default router;
