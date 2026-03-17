import item from "../models/item.js";
import cloudinary from "../config/upload.js";

async function updateTotalStock(id) {
    const itens = await item.findById(id);
    return await item.findByIdAndUpdate(id, { estoqueTotal: itens.var.reduce((total, v) => total + v.estoque, 0) });
}

const getAllItems = async (filter) => {
    try {
        let itens;
        if (filter) {
            try {
                itens = await item.find({
                    $or: [
                        { nome: { $regex: filter, $options: 'i' } },
                        { catProduto: { $regex: filter, $options: 'i' } },
                        { catModelo: { $regex: filter, $options: 'i' } },
                        { codigo: { $regex: filter, $options: 'i' } },
                        { "var.codigo": { $regex: filter, $options: 'i' } },
                        { "var.cor": { $regex: filter, $options: 'i' } }
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
    if (preco <= 0) preco = 0
    const newItem = await new item(
        {
            nome: nome,
            catProduto: catProduto,
            catModelo: catModelo,
            codigo: codigo.padStart(2, "0"),
            preco: Number(preco),
            imagem: imagem,
        }).save();
    return newItem;
}

const updateItem = async (id, updateData) => {
    try {
        const updatedItem = await item.findByIdAndUpdate(id, updateData, { new: true });
        return updatedItem;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateVarEstoque = async (id, codigo, estoque) => {
    try {
        const updatedItem = await item.findOneAndUpdate({
            _id: id,
            "var.codigo": codigo
        },
            { $set: { "var.$.estoque": estoque } },
            { new: true }
        );
        await updateTotalStock(id);
        return updatedItem;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteItem = async (id) => {
    try {
        const delItem = await item.findByIdAndDelete(id)
        if (!delItem) {
            const err = new Error("item não encontrado");
            err.statusCode = 404;
            throw err;
        }
    } catch (error) {
        console.error(error);
    }
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