import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        item: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            enum: ["saida", "entrada", "balanco", "adicionado", "alterado", "removido"],
            required: true
        },
        quantidade: {
            type: Number
        },
        data: {
            type: String,
            required: true
        },
        observacao: {
            type: String
        },
        usuario: {
            type: String,
            required: true
        }
    }
)

const historico = mongoose.model("historico", itemSchema, "historico")
export default historico;