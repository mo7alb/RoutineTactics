import express from "express";
import {
	createProject,
	getProjects,
	getProject,
	updateProject,
	deleteProject,
} from "../controllers/projects";

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);

router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
