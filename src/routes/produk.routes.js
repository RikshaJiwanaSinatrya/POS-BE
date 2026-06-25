const express = require('express');
const router = express.Router();

const produkController = require ('../controllers/produk.controller');
const authMiddleware = require ('../middlewares/auth.middleware');
const upload = require ('../middlewares/upload.middleware');

router.get('/', produkController.getAllProduk);
router.post('/', authMiddleware, upload.single('foto_produk'), produkController.createProduk);
router.put('/:id', authMiddleware, upload.single('foto_produk'), produkController.updateProduk);
router.get('/:id', produkController.getProdukById);
router.delete('/:id', authMiddleware, produkController.deleteProduk);

module.exports = router;