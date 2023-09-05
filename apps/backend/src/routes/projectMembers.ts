import express from "express";
import { ProjectMembersController } from "../controllers";

const router = express.Router();
const controller = new ProjectMembersController();

router.get("/:id", controller.getProjectMembers);
router.delete("/:id", controller.deleteProjectMember);

export { router as ProjectMemberRouter };
