import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
    {
        cor: {
            type: String,
            required: true
        },
        codigo: {
            type: String,
            required: true
        }
    }
)

const color = mongoose.model("cor", categorySchema, "cores")
export default color;