import express from "express";
import { GET, POST, DELETE } from "../controllers/user";

const router = express.Router();

// get user info
router.get("/:id", GET);

// register new user
router.get("/", POST);

// delete user account
router.get("/:id", DELETE);

export default router;
