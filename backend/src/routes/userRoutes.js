import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import userController from "../controllers/userController.js"

const router = express.Router();

router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/users/:id", authMiddleware, userController.getUser);

router.post("/login", userController.login);
router.post("/register", userController.register);

export default router;