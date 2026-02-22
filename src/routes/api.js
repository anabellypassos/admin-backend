const express = require('express');
const router = express.Router();
const User = require('../controllers/UserController');
const Admin = require('../controllers/AdminController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/login', User.login);
router.post('/register', User.register);

router.get('/stats', auth(['ADMIN', 'EDITOR']), Admin.getStats);
router.get('/products', auth(['ADMIN', 'EDITOR']), Admin.listProducts);

// Garanta que os nomes depois do ponto batem com os nomes no Controller:
router.post('/products', auth(['ADMIN']), upload.single('image'), Admin.createProduct);
router.delete('/products/:id', auth(['ADMIN']), Admin.deleteProduct);

router.get('/users', auth(['ADMIN']), User.listUsers);
router.delete('/users/:id', auth(['ADMIN']), User.deleteUser);

module.exports = router;