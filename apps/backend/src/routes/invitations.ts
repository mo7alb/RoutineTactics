import { Router } from "express";
import { InvitationController } from "../controllers";

const router = Router();
const controller = new InvitationController();

// mapping different routes to different invitation controllers
router.get("/", controller.getInvitations);
router.post("/", controller.createInvitation);
router.put("/:id", controller.updateInvitation);

export { router as InvitationRouter };
