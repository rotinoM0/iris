import express from "express"

import authMiddleware from "../middlewares/authMiddleware.js"
import userController from "../controllers/userController.js"
import { authLimiter } from "../middlewares/rateLimiter.js"
import userRoutes from "./userRoutes.js"
import itemRoutes from "./itemRoutes.js"
import categoryRoutes from "./categoryRoutes.js"
import historyRoutes from "./historyRoutes.js"

const router = express.Router();

router.post("/auth/login", authLimiter, userController.login);
router.post("/auth/register", authLimiter, userController.register);

router.use(authMiddleware);

router.use("/items", itemRoutes);
router.use("/categories", categoryRoutes);
router.use("/history", historyRoutes);
router.use("/auth/users", userRoutes);

export default router;