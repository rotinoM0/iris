import express from "express"
import categoryController from "../controllers/categoryController.js"

const router = express.Router()

router.get("/", categoryController.getAll);
router.get("/modelos", categoryController.getModels);
router.get("/:id/modelos", categoryController.getModelsById);

router.post("/", categoryController.add);

router.patch("/:id", categoryController.addModel);
router.patch("/:id/modelos", categoryController.deleteModel);

router.delete("/:id", categoryController.deleteCategory);

export default router;