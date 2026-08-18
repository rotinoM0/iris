import express from "express"
import categoryController from "../controllers/categoryController.js"
import isAdmin from "../middlewares/isAdmin.js"

const router = express.Router()

router.get("/", categoryController.getAll);
router.get("/modelos", categoryController.getModels);
router.get("/:id/modelos", categoryController.getModelsById);

router.post("/", categoryController.add);

router.patch("/:id", categoryController.addModel);
router.patch("/:id/modelos", isAdmin, categoryController.deleteModel);

router.delete("/:id", isAdmin, categoryController.deleteCategory);

export default router;