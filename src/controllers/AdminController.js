const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { z } = require('zod');

const AdminController = {
    async getStats(req, res) {
        try {
            const totalUsers = await prisma.user.count();
            const totalProducts = await prisma.product.count();
            const inventoryValue = await prisma.product.aggregate({ _sum: { price: true } });
            res.json({ totalUsers, totalProducts, totalValue: inventoryValue._sum.price || 0 });
        } catch (e) { res.status(500).json({ error: "Erro ao buscar stats" }); }
    },

    async createProduct(req, res) {
        try {
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
            const product = await prisma.product.create({
                data: {
                    name: req.body.name,
                    price: parseFloat(req.body.price),
                    stock: parseInt(req.body.stock),
                    image: imageUrl
                }
            });
            res.status(201).json(product);
        } catch (err) { res.status(400).json({ error: "Erro ao criar produto" }); }
    },

    async listProducts(req, res) {
        const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(products);
    },

    // VERIFIQUE SE ESTA FUNÇÃO EXISTE EXATAMENTE ASSIM:
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await prisma.product.delete({ where: { id } });
            res.json({ message: "Produto removido com sucesso" });
        } catch (error) {
            res.status(400).json({ error: "Erro ao remover produto" });
        }
    }
};

module.exports = AdminController;