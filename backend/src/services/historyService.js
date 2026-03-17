import historico from "../models/history.js";

const getHistory = async (filter, type) => {
    try {  
        if (filter) {
            const history = await historico.find({
                $or: [
                    { item: { $regex: filter, $options: 'i' } },
                    { data: { $regex: filter, $options: 'i' } },
                    { observacao: { $regex: filter, $options: 'i' } },
                    { usuario: { $regex: filter, $options: 'i' } }
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
    const newHistory = await new historico({
        item: item,
        tipo: tipo,
        quantidade: quantidade,
        data: data,
        observacao: observacao,
        usuario: usuario
    }).save();
    return newHistory;
}

export default {
    getHistory,
    addHistory
}