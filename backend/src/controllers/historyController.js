import historyService from "../services/historyService.js";

const getHistory = async (req, res, next) => {
    const filter = req.query.filter;
    const type = req.query.type;

    try {
        const history = await historyService.getHistory(filter, type);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
}

const addHistory = async (req, res, next) => {
    let history = null;
    if (!req.user) {
        const err = new Error("Acesso negado");
        err.statusCode = 401;
        throw err;
    }
    
    try {
        const { item, tipo, quantidade, data, observacao } = req.body;
        const usuario = req.user.nome;

        if (!item || !tipo || !usuario) {
            const err = new Error("Dados incompletos");
            err.statusCode = 400;
            throw err;
        }

        if (tipo === "saida" || tipo === "entrada") {
            if (!quantidade) {
                const err = new Error("Quantidade não informada");
                err.statusCode = 400;
                throw err;
            }
        }
        
        history = await historyService.addHistory(item, tipo, quantidade, data, observacao, usuario);
        history = await historyService.getHistory();
        res.status(201).json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
}


export default {
    getHistory,
    addHistory
}