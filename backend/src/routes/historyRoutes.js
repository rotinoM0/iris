import historyController from "../controllers/historyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/", historyController.getHistory);
router.post("/", authMiddleware, historyController.addHistory);

export default router;