const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UserController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const hashed = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: { name, email, password: hashed, role: "EDITOR" }
            });
            res.status(201).json({ message: "Criado!" });
        } catch (e) { res.status(400).json({ error: "Erro ao criar" }); }
    },

    async login(req, res) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Incorreto" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, role: user.role } });
    },

    async listUsers(req, res) {
        const users = await prisma.user.findMany();
        res.json(users);
    },

    // VERIFIQUE SE ESTA FUNÇÃO EXISTE EXATAMENTE ASSIM:
    async deleteUser(req, res) {
        try {
            await prisma.user.delete({ where: { id: req.params.id } });
            res.json({ message: "Usuário removido" });
        } catch (e) { res.status(400).json({ error: "Erro ao remover" }); }
    }
};

module.exports = UserController;