import express from "express"

import userRoutes from "./userRoutes.js"
import itemRoutes from "./itemRoutes.js"
import categoryRoutes from "./categoryRoutes.js"
import historyRoutes from "./historyRoutes.js"

const router = express.Router();

router.use("/items", itemRoutes);

router.use("/auth", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/history", historyRoutes);

export default router;