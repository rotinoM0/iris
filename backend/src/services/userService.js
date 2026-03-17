import User from "../models/user.js"

import pkg from "jsonwebtoken";

const { sign } = pkg;

const getAllUsers = async () => {
    return await User.find().select("-senha");
}

const getUser = async (id) => {
    const user = await User.findById(id).select("-senha");
    if (!user) {
        const err = new Error("Usuário não encontrado");
        err.statusCode = 404;
        throw err;
    }
    return user;
}

const register = async (nome, senha) => {
    const user = await User.findOne({ nome });
    if (user) {
        const err = new Error("Usuário já cadastrado");
        err.statusCode = 409;
        throw err;
    }
    const newUser = await new User({ nome, senha }).save();
    return newUser;
}

const login = async (nome, senha) => {
    const user = await User.findOne({ nome }).select("+senha");
    if (!user) {
        const err = new Error("Usuário não encontrado")
        err.statusCode = 404;
        throw err;
    }

    const match = await user.matchPassword(senha);
    if (!match) {
        const err = new Error("Usuário ou senha incorreta");
        err.statusCode = 401;
        throw err;
    }
    const token = sign(
        { _id: user._id, nome: user.nome },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )


    return token;
}



// const loginAdmin = async(nome, senha) => {
//     if (nome === "Admin" && senha === "admin") {
//         const token = sign({nome}, process.env.JWT_SECRET, {expiresIn: "7d"})
//         return token;
//     }
//     const user = await User.findOne({nome, senha});
//     if (!user) {
//         const err = new Error("Usuário ou senha incorretos");
//         err.statusCode = 401;
//         throw err
//     }
//     return user;
// }

export default {
    getAllUsers,
    getUser,
    login,
    register
}