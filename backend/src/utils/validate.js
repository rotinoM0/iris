const isString = (value) => typeof value === "string" && value.trim().length > 0;

const badRequest = (message) => {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
};

const sanitizeFilter = (filter) => {
    if (filter !== undefined && filter !== null && String(filter).length > 100) {
        throw badRequest("Filtro muito longo");
    }
    if (!isString(filter)) return "";
    return filter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const validateRegister = ({ nome, senha }) => {
    if (!isString(nome)) throw badRequest("Nome é obrigatório");
    if (nome.trim().length > 30) throw badRequest("Nome precisa ter no máximo 30 caracteres");
    if (!isString(senha)) throw badRequest("Senha é obrigatória");
    if (senha.length < 6) throw badRequest("Senha precisa ter no mínimo 6 caracteres");
    if (senha.length > 30) throw badRequest("Senha precisa ter no máximo 30 caracteres");
};

const validateLogin = ({ nome, senha }) => {
    if (!isString(nome) || !isString(senha)) {
        throw badRequest("Usuário e senha são obrigatórios");
    }
};

const validateItem = ({ nome, catProduto, codigo, preco }) => {
    if (!isString(nome)) throw badRequest("Nome é obrigatório");
    if (!isString(catProduto)) throw badRequest("Categoria é obrigatória");
    if (codigo === undefined || codigo === null || String(codigo).trim() === "") {
        throw badRequest("Código é obrigatório");
    }
    if (preco !== undefined && preco !== null && preco !== "") {
        const numero = Number(preco);
        if (Number.isNaN(numero) || numero < 0) throw badRequest("Preço inválido");
    }
};

export {
    validateRegister,
    validateLogin,
    validateItem,
    sanitizeFilter,
};