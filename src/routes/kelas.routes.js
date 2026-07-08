const express = require('express')
const router = express.Router()

const kelasController = require('../controllers/kelas.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const allowRoles = require('../middlewares/role.middleware')

router.get('/', authMiddleware, allowRoles('admin'), kelasController.getAll)
router.get('/:kode_kelas', authMiddleware, allowRoles('admin'), kelasController.getById)
router.post('/', authMiddleware, allowRoles('admin'), kelasController.create)
router.put('/:id', authMiddleware, allowRoles('admin'), kelasController.update)
router.delete('/:id', authMiddleware, allowRoles('admin'), kelasController.delete)

module.exports = router
