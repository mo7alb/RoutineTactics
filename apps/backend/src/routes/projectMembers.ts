import express from "express";
import { ProjectMembersController } from "../controllers";

const router = express.Router();
const controller = new ProjectMembersController();

router.post("/", controller.createProjectMember);
router.post("/accept/:id", controller.acceptProjectMember);
router.post("/reject/:id", controller.rejectProjectMember);
router.delete("/:id", controller.deleteProjectMember);

export { router as ProjectMemberRouter };
