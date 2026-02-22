const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// --- CONFIGURAÇÃO DE PASTAS ---
// Isso garante que a pasta 'uploads' exista na raiz do projeto para não dar erro no Multer
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --- MIDDLEWARES ---
app.use(cors()); // Libera o acesso para o Frontend (React, Vue, etc)
app.use(express.json()); // Permite que o servidor entenda JSON

// --- ARQUIVOS ESTÁTICOS ---
// Isso permite que você acesse as fotos via navegador
// Exemplo: http://localhost:5000/uploads/nome-da-foto.jpg
app.use('/uploads', express.static(uploadDir));

// --- ROTAS ---
app.use('/api', apiRoutes);

// --- INICIALIZAÇÃO ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
    console.log(`📂 Pasta de uploads pronta em: ${uploadDir}`);
});