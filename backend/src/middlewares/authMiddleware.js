import jwt from"jsonwebtoken"
import config from "../config/env.js"
import userService from "../services/userService.js";

const authMiddleware = async (req, res, next) => {
    try {

        
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Token não fornecido"
            })
        }
        
        const decoded = jwt.verify(token, config.jwtSecret);
        
        const user = await userService.getUser(decoded._id);
        req.token = token;
        req.user = user;
        

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Token inválido: " + error.message
        })
    }
}

export default authMiddleware;