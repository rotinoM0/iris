const isAdmin = (req, res, next) => {
    if (req.user?.cargo !== "admin") {
        return res.status(403).json({
            success: false,
            error: "Acesso negado: requer perfil de administrador"
        });
    }
    next();
}

export default isAdmin;