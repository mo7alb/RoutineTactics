import express from "express";
import { NotificationController } from "../controllers/notifications";

const router = express.Router();
const controller = new NotificationController();

router.get("/", controller.sendNotification);

export { router as notificationRouter };
