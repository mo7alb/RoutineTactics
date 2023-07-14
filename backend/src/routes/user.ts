import express from "express";
import { GET, POST, DELETE } from "../controllers/user";

const router = express.Router();

// get user info
router.get("/:id", GET);

// register new user
router.post("/", POST);

// delete user account
router.delete("/:id", DELETE);

export default router;
