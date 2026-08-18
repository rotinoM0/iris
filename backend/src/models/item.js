import mongoose from "mongoose"

const itemSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },
        catProduto: {
            type: String,
            required: true
        },
        catModelo: {
            type: String
        },
        codigo: {
            type: String,
            required: true
        },
        estoqueTotal: {
            type: Number,
            default: 0,
            min: [0, "Estoque total precisa ser maior ou igual a 0"]
        },
        preco: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Preço precisa ser maior ou igual a 0"]
        },
        imagem: {
            type: {
                url: String,
                public_id: String
            },
            _id: false
        },
        var: [
            {
                codigo: {
                    type: String
                },
                cor: {
                    type: String
                },
                estoque: {
                    type: Number,
                    min: [0, "Estoque precisa ser maior ou igual a 0"],
                    default: 0
                }
            }
        ]
    }
)

const item = mongoose.model("item", itemSchema, "items")
export default item;