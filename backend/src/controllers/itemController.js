import itemService from "../services/itemService.js"
import upload from "../config/upload.js";
import cloudinary from "../config/upload.js";

const getAll = async (req, res, next) => {
    try {
        const filter = req.query.filter;
        let itens;
        if (!filter) {
            itens = await itemService.getAllItems();
        } else
            itens = await itemService.getAllItems(filter);
        res.status(200).json({ success: true, data: itens });
    } catch (error) {
        next(error);
    }
}

const getItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { varCodigo } = req.query;
        if (varCodigo) {
            const item = await itemService.getVarEstoque(id, varCodigo);
            res.status(200).json({ success: true, data: item });
        }
        const item = await itemService.getItem(id);
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
}

const getCat = async (req, res, next) => {
    try {
        const { catProduto } = req.params
        const itens = await itemService.getCat(catProduto);
        res.status(200).json({ success: true, data: itens });
    } catch (error) {
        next(error);
    }
}

const getVarEstoque = async (req, res, next) => {
    try {
        const { id } = req.params;
        const itemData = await itemService.getItem(id);
        const varEstoque = itemData.var.map(variacao => ({
            codigo: variacao.codigo,
            estoque: variacao.estoque
        }));
        res.status(200).json({ success: true, data: varEstoque });
    } catch (error) {
        next(error);
    }
}

const addItem = async (req, res, next) => {
    try {
        const { nome, catProduto, catModelo, codigo, preco } = req.body

        if (req.file) {
            const uploadRes = await new Promise((resolve, reject) => {
                upload.cloudinary.uploader.upload_stream(
                    {
                        folder: "items",
                        transformation: [
                            { width: 500, height: 500, crop: "pad" },
                            { quality: "auto", fetch_format: "auto" }
                        ]
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    },
                ).end(req.file.buffer);
            });
            const imagem = {
                url: uploadRes.secure_url,
                name: uploadRes.public_id
            }
            await itemService.addItem(
                nome,
                catProduto,
                catModelo,
                codigo,
                preco,
                imagem
            );
        } else {
            await itemService.addItem(nome, catProduto, catModelo, codigo, preco, imagem);
        }
        await res.status(201).json(itemService.getAllItems())
    } catch (err) {
        next(err)
    }
}

const updateVarEstoque = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { codigo } = req.query;
        const { estoque } = req.body;
        const updatedItem = await itemService.updateVarEstoque(id, codigo, estoque);
        res.status(200).json({ success: true, data: updatedItem });
    } catch (err) {
        next(err)
    }
}

const updatedItem = async (req, res, next) => {
    try {
        const { id } = req.params
        const { nome, catProduto, catModelo, preco } = req.body
        const updateData = {
            nome,
            catProduto,
            catModelo,
            preco
        }
        if (req.file) {
            const currentImagem = await itemService.getItem(id).then(item => item.imagem);
            if (currentImagem.public_id)
                await cloudinary.deleteImage(currentImagem.public_id);
            const uploadRes = await new Promise((resolve, reject) => {
                upload.cloudinary.uploader.upload_stream(
                    {
                        folder: "items",
                        transformation: [
                            { width: 500, height: 500, crop: "pad" },
                            { quality: "auto", fetch_format: "auto" }
                        ]
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    },
                ).end(req.file.buffer);
            })
            const imagem = {
                url: uploadRes.secure_url,
                public_id: uploadRes.public_id
            }
            updateData.imagem = imagem;
        }

        await itemService.updateItem(id, updateData);
        await res.status(201).json(itemService.getAllItems())
    } catch (err) {
        next(err)
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params
        await itemService.deleteItem(id);
        await res.status(201).json({ success: true, data: "deletado" })
    } catch (err) {
        next(err)
    }
}

const deleteVar = async (req, res, next) => {
    try {
        const { id } = req.params
        const { codigo } = req.body
        await itemService.deleteVar(id, codigo);
        await res.status(201).json({ success: true, data: "deletado" })
    } catch (err) {
        next(err)
    }
}

export default {
    getAll,
    getItem,
    getCat,
    getVarEstoque,
    addItem,
    updatedItem,
    updateVarEstoque,
    deleteItem,
    deleteVar
}