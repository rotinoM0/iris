import categoryService from "../services/categoryService.js"

const getAll = async (req, res, next) => {
    try {
        const categories = await categoryService.getAll();
        res.status(200).json({success: true, data: categories});
    } catch (error) {
        next(error);
    }
}

const getModels = async (req, res, next) => {
    try {
        const categories = await categoryService.getModels();
        res.status(200).json({success: true, data: categories});
    } catch (error) {
        next(error);
    }
}

const getModelsById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const categoryData = await categoryService.getModelsById(id);
        res.status(200).json({success: true, data: categoryData});
    } catch (error) {
        next(error);
    }
}

const add = async (req, res, next) => {
    try {
        const {produto, codigo, modelos} = req.body
        await categoryService.add(produto, codigo, modelos);
        const categories = await categoryService.getAll();
        res.status(201).json(categories)
    } catch (err) {
        next(err);
    }
}

const addModel = async (req, res, next) => {
    try {
        const {id} = req.params
        const {nome, codigo} = req.body
        const cat = await categoryService.addModel(id, nome, codigo);
        res.status(200).json({success: true, data: cat})
    } catch (err) {
        next(err);
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const {id} = req.params;
        await categoryService.deleteCategory(id);
        res.status(200).json({success: true, data: 'Categoria deletada'});
    } catch (error) {
        next(error);
    }
}

const deleteModel = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {codigo} = req.body;
        await categoryService.deleteModel(id, codigo);
        res.status(200).json({success: true, data: 'Modelo deletado'});
    } catch (error) {
        next(error);
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
};