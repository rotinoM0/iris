import express from "express"
import userController from "../controllers/userController.js"
import isAdmin from "../middlewares/isAdmin.js"

const router = express.Router();

router.get("/", isAdmin, userController.getAllUsers);
router.get("/:id", isAdmin, userController.getUser);

export default router;