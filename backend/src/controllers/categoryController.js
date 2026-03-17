import categoryService from "../services/categoryService.js"

const getAll = async (req, res) => {
    try {
        const categories = await categoryService.getAll();
        res.status(200).json({success: true, data: categories});
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'internal error' })
    }
}

const getModels = async (req, res) => {
    try {
        const categories = await categoryService.getModels();
        res.status(200).json({success: true, data: categories});
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'internal error' })
    }
}

const getModelsById = async (req, res) => {
    try {
        const {id} = req.params;
        const categoryData = await categoryService.getModelsById(id);
        res.status(200).json({success: true, data: categoryData});
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'internal error' })
    }
}

const add = async (req, res) => {
    try {
        const {produto, codigo, categorias, modelos} = req.body
        await categoryService.add(produto, codigo, categorias, modelos);
        await res.status(201).json(categoryService.getAll())
    } catch (err) {
        res.status(500)
        console.error(err);
    }
}

const addModel = async (req, res) => {
    try {
        const {id} = req.params
        const {nome, codigo} = req.body
        const cat = await categoryService.addModel(id, nome, codigo);
        res.status(201).json({success: true, data: cat})
    } catch (err) {
        res.status(500)
        console.error(err);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params;
        await categoryService.deleteCategory(id);
        await res.status(200).json({success: true, data: 'Categoria deletada'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'internal error' })
    }
}

const deleteModel = async (req, res) => {
    try {
        const {id} = req.params;
        const {codigo} = req.body;
        await categoryService.deleteModel(id, codigo);
        await res.status(200).json({success: true, data: 'Modelo deletado'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'internal error' })
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