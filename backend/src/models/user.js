import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true,
            maxlength: [30, "Nome precisa ter no máximo 30 caracteres"]
        },
        senha: {
            type: String,
            required: true,
            minlength: [6, "Senha precisa ter no mínimo 6 caracteres"],
            maxlength: [30, "Senha precisa ter no máximo 30 caracteres"],
            select: false
        },
        cargo: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
    },
    {
        timestamps: true
    }
)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("senha")) 
        return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt)
})

UserSchema.methods.matchPassword = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
}

const User = mongoose.model("User", UserSchema, "users")
export default User;