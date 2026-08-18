import item from "../models/item.js";
import cloudinary from "../config/upload.js";
import { validateItem, sanitizeFilter } from "../utils/validate.js";

async function updateTotalStock(id) {
    const itens = await item.findById(id);
    if (!itens) return null;
    const estoqueTotal = (itens.var || []).reduce((total, v) => total + (Number(v.estoque) || 0), 0);
    return await item.findByIdAndUpdate(id, { estoqueTotal }, { new: true });
}

const getAllItems = async (filter) => {
    try {
        let itens;
        if (filter) {
            const safeFilter = sanitizeFilter(filter);
            try {
                itens = await item.find({
                    $or: [
                        { nome: { $regex: safeFilter, $options: 'i' } },
                        { catProduto: { $regex: safeFilter, $options: 'i' } },
                        { catModelo: { $regex: safeFilter, $options: 'i' } },
                        { codigo: { $regex: safeFilter, $options: 'i' } },
                        { "var.codigo": { $regex: safeFilter, $options: 'i' } },
                        { "var.cor": { $regex: safeFilter, $options: 'i' } }
                    ]
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        } else
            itens = await item.find().sort({ codigo: 1, nome: 1 });
        return itens;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const getItem = async (id) => {
    const itemData = await item.findById(id);
    return itemData;
}

const getCat = async (catProduto) => {
    const itens = await item.find({ catProduto: catProduto });
    return itens;
}

const getVarEstoque = async (id, varCodigo) => {
    try {
        const itemData = await item.findOne({ _id: id, "var.codigo": varCodigo }, { "var.estoque": 1 });
        return itemData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addItem = async (nome, catProduto, catModelo, codigo, preco, imagem) => {
    validateItem({ nome, catProduto, codigo, preco });
    const precoFinal = Number(preco);
    const newItem = await new item(
        {
            nome: nome,
            catProduto: catProduto,
            catModelo: catModelo,
            codigo: String(codigo).padStart(2, "0"),
            preco: Number.isNaN(precoFinal) || precoFinal < 0 ? 0 : precoFinal,
            imagem: imagem,
        }).save();
    return newItem;
}

const updateItem = async (id, updateData) => {
    try {
        const updatedItem = await item.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        return updatedItem;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateVarEstoque = async (id, codigo, estoque) => {
    try {
        const numero = Number(estoque);
        if (estoque === undefined || estoque === null || estoque === "" || Number.isNaN(numero) || numero < 0 || !Number.isInteger(numero)) {
            const err = new Error("Estoque deve ser um número inteiro maior ou igual a 0");
            err.statusCode = 400;
            throw err;
        }
        if (!codigo || typeof codigo !== "string") {
            const err = new Error("Código da variação é obrigatório");
            err.statusCode = 400;
            throw err;
        }
        const updatedItem = await item.findOneAndUpdate(
            { _id: id, "var.codigo": codigo },
            { $set: { "var.$.estoque": numero } },
            { new: true }
        );
        if (updatedItem) {
            await updateTotalStock(id);
            return updatedItem;
        }
        const pushedItem = await item.findOneAndUpdate(
            { _id: id },
            { $push: { var: { codigo: codigo, estoque: numero } } },
            { new: true, runValidators: true }
        );
        if (!pushedItem) {
            const err = new Error("Item não encontrado");
            err.statusCode = 404;
            throw err;
        }
        await updateTotalStock(id);
        return pushedItem;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteItem = async (id) => {
    const existing = await item.findById(id);
    if (!existing) {
        const err = new Error("item não encontrado");
        err.statusCode = 404;
        throw err;
    }
    const publicId = existing.imagem?.public_id;
    if (publicId) {
        try {
            await cloudinary.deleteImage(publicId);
        } catch (error) {
            console.error(error);
        }
    }
    await item.findByIdAndDelete(id);
    return existing;
}

const deleteVar = async (id, codigo) => {
    try {
        const delVar = await item.updateOne(
            { "_id": id },
            { $pull: { var: { codigo: codigo } } }
        );
        await updateTotalStock(id);
        return delVar;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export default {
    getAllItems,
    getItem,
    getCat,
    getVarEstoque,
    addItem,
    updateItem,
    updateVarEstoque,
    deleteItem,
    deleteVar
}