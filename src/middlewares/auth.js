const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) return res.status(401).json({ error: "Acesso negado. Faça login." });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Verifica se o cargo do usuário tem permissão
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Você não tem permissão para isso." });
            }

            next();
        } catch (err) {
            res.status(401).json({ error: "Token inválido ou expirado." });
        }
    };
};

module.exports = authMiddleware;