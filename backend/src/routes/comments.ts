import express from "express";
import { GET } from "../controllers/comments";

const router = express.Router();

// get list of comments
router.get("/:id", GET);

export default router;
