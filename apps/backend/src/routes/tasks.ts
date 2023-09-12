import express from "express";
import { TaskController } from "../controllers";

const router = express.Router();
const controller = new TaskController();

// mapping different routes to different task controllers
router.get("/", controller.getTasks);
router.post("/", controller.createTask);
router.get("/:id", controller.getTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

export { router as TaskRouter };
