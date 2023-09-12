import express from "express";
import { CommentController } from "../controllers";

const router = express.Router();
const controller = new CommentController();

// mapping different routes to different comment controllers
router.post("/", controller.createComment);
router.get("/:id", controller.getComment);
router.put("/:id", controller.updateComment);
router.delete("/:id", controller.deleteComment);

export { router as CommentRouter };
