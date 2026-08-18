import historyController from "../controllers/historyController.js";
import express from "express";

const router = express.Router();

router.get("/", historyController.getHistory);
router.post("/", historyController.addHistory);

export default router;