import express from "express";

const router = express.Router();
const controller = new ProjectMemberController();

router.post("/", controller.createProjectMember);
router.post("/accept/:id", controller.acceptProjectMember);
router.delete("/:id", controller.deleteProjectMember);

export { router as ProjectMemberRouter };
