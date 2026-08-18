import User from "../models/user.js"
import { validateRegister, validateLogin } from "../utils/validate.js"

import pkg from "jsonwebtoken";
import config from "../config/env.js";

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
    validateRegister({ nome, senha });
    const user = await User.findOne({ nome });
    if (user) {
        const err = new Error("Usuário já cadastrado");
        err.statusCode = 409;
        throw err;
    }
    try {
        const newUser = await new User({ nome, senha }).save();
        return newUser;
    } catch (error) {
        if (error?.code === 11000) {
            const err = new Error("Usuário já cadastrado");
            err.statusCode = 409;
            throw err;
        }
        throw error;
    }
}

const login = async (nome, senha) => {
    validateLogin({ nome, senha });
    const unauthorized = () => {
        const err = new Error("Usuário ou senha incorretos")
        err.statusCode = 401;
        return err;
    }

    const user = await User.findOne({ nome }).select("+senha");
    if (!user) {
        throw unauthorized();
    }

    const match = await user.matchPassword(senha);
    if (!match) {
        throw unauthorized();
    }
    const token = sign(
        { _id: user._id, nome: user.nome },
        config.jwtSecret,
        { expiresIn: config.jwtExpire || "7d" }
    )

    return {
        token,
        user: {
            nome: user.nome,
            cargo: user.cargo
        }
    };
}



export default {
    getAllUsers,
    getUser,
    login,
    register
}