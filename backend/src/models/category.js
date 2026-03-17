import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
    {
        produto: {
            type: String,
            required: true
        },
        codigo: {
            type: String,
            required: true
        },
        modelos: [
            {
                nome: {
                    type: String,
                    required: true
                },
                codigo: {
                    type: String
                }
            }
        ]
    }
)

const category = mongoose.model("category", categorySchema, "categories")
export default category;