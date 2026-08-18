import historico from "../models/history.js";
import { sanitizeFilter } from "../utils/validate.js";

const getHistory = async (filter, type) => {
    try {  
        if (filter) {
            const safeFilter = sanitizeFilter(filter);
            const history = await historico.find({
                $or: [
                    { item: { $regex: safeFilter, $options: 'i' } },
                    { observacao: { $regex: safeFilter, $options: 'i' } },
                    { usuario: { $regex: safeFilter, $options: 'i' } }
                ]
            }).sort({ data: -1 });

            if (type) {
                return history.filter(h => h.tipo === type);
            }
            return history;
        }
        if (type) {
            const history = await historico.find({ tipo: type }).sort({ data: -1 });
            return history;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
    const history = await historico.find().sort({ data: -1 });
    return history
}

const addHistory = async (item, tipo, quantidade, data, observacao, usuario) => {
    let dataDate = data;
    if (data) {
        const parsed = new Date(data);
        if (Number.isNaN(parsed.getTime())) {
            const err = new Error("Data inválida");
            err.statusCode = 400;
            throw err;
        }
        dataDate = parsed;
    }
    const newHistory = await new historico({
        item: item,
        tipo: tipo,
        quantidade: quantidade,
        data: dataDate,
        observacao: observacao,
        usuario: usuario
    }).save();
    return newHistory;
}

export default {
    getHistory,
    addHistory
}