import express from "express";
import { CommentController } from "../controllers";

const router = express.Router();
const controller = new CommentController();

router.post("/", controller.createComment);
router.put("/:id", controller.updateComment);
router.delete("/:id", controller.deleteComment);

export { router as CommentRouter };
