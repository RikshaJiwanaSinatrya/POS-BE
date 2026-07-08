const express = require('express');
const router = express.Router();

const produkController = require ('../controllers/produk.controller');
const authMiddleware = require ('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware')

router.get('/', produkController.getAllProduk);
router.post('/', authMiddleware, allowRoles('admin'), produkController.createProduk);
router.put('/:id', authMiddleware, allowRoles('admin'), produkController.updateProduk);
router.get('/:id', produkController.getProdukById);
router.delete('/:id', authMiddleware, allowRoles('admin'), produkController.deleteProduk);

module.exports = router;