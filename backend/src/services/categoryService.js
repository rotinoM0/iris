import category from "../models/category.js"

const getAll = async () => {
    const categories = await category.find();
    return categories;
}

const getModels = async () => {
    const categories = await category.find({}, { modelos: 1, _id: 0 });
    return categories;
};

const getModelsById = async (id) => {
    const categoryData = await category.findById(id, { modelos: 1, _id: 0 });
    return categoryData;
};

const add = async (produto, codigo, categorias, modelos) => {
    const newCategory = await new category({
        produto: produto,
        codigo: codigo,
        categorias: categorias || [],
        modelos: modelos || []
    }).save();
    return newCategory;
}

const addModel = async (id, nome, codigo) => {
    try {
        const cat = await category.findByIdAndUpdate(
            id,
            { $push: { modelos: { nome: nome, codigo: codigo }}},
            { new: true, runValidators: true }
        )
        return cat;
    } catch (error) {
        console.error(error);
        throw error
    }
};

const deleteCategory = async (id) => {
    try {
        const delCategory = await category.findByIdAndDelete(id)
        if (!delCategory) {
            const err = new Error("item não encontrado");
            err.statusCode = 404;
            throw err;
        }
        return delCategory;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteModel = async (id, codigo) => {
    try {
        const cat = await category.updateOne(
            {"_id": id}, 
            { $pull: { modelos: { codigo: codigo } } });
        return cat;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export default {
    getAll,
    getModels,
    getModelsById,
    add,
    addModel,
    deleteCategory,
    deleteModel
}