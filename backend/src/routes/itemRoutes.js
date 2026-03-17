import express from "express"
import itemController from "../controllers/itemController.js";
import upload from "../config/upload.js";

const router = express.Router();
router.get("/", itemController.getAll);
router.get("/:id", itemController.getItem);
router.get("/categorias/:catProduto", itemController.getCat);
router.get("/:id/estoque", itemController.getVarEstoque);

router.post("/", upload.upload.single("imagem"), itemController.addItem);

router.patch("/:id", upload.upload.single("imagem"), itemController.updatedItem);
router.patch("/:id/estoque", itemController.updateVarEstoque);
router.patch("/:id/var", itemController.deleteVar);


router.delete("/:id", itemController.deleteItem);

export default router;