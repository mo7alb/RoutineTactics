import express from "express";
import { GET, POST, PUT, DELETE } from "../controllers/board";

const router = express.Router();

// get board details
router.get("/:id", GET);

// add new board
router.post("/", POST);

// update board
router.put("/:id", PUT);

// delete board
router.delete("/:id", DELETE);

export default router;
