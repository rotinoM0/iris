import userService from "../services/userService.js";

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({success: true, data: users});
    } catch (error) {
        next(error);

    }
}

const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await userService.getUser(id);
        res.status(200).json({success: true, data: user});
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const {nome, senha} = req.body;
        const user = await userService.login(nome, senha);
        res.status(200).json({
            success: true, 
            token: user, 
            user: {
                nome: nome
            }
        });
    } catch (error) {
        next(error);
    }
}

const register = async (req, res, next) => {
    try {
        const {nome, senha} = req.body;
        const user = await userService.register(nome, senha);
        res.status(201).json({success: true, data: user});
    } catch (error) {
        next(error);
    }
}

export default {
    getAllUsers,
    getUser,
    login,
    register

}