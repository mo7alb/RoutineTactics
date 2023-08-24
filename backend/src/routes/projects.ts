import express from "express";
import { ProjectController } from "../controllers";

const router = express.Router();

const controller = new ProjectController();

router.post("/", controller.createProject);
router.get("/", controller.getProjects);
router.get("/:id", controller.getProject);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

export { router as ProjectRouter };
