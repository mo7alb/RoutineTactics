import express from "express";
import { UserController } from "../controllers/user";

const router = express.Router();
const controller = new UserController();

router.post("/", controller.createUser);
router.put("/", controller.updateToken);

export { router as UserRouter };
