import config from "../config/env.js";

const errorHandler = (err, req, res, _next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = (statusCode >= 500 && config.nodeEnv !== "development")
        ? "Erro interno"
        : err.message;

    res.status(statusCode).json({ 
        success: false,
        error: message
    });
}

export default errorHandler;