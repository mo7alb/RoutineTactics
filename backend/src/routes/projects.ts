import express from "express";
import { getProjects } from "../controllers/projects";

const router = express.Router();

router.get("/", getProjects);

export default router;
