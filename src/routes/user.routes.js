const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const allowRoles = require('../middlewares/role.middleware')

router.post('/', authMiddleware, allowRoles('admin'), userController.create)
router.get('/', authMiddleware, allowRoles('admin'), userController.getAll)
router.get('/:id', authMiddleware, allowRoles('admin'), userController.getById)
router.delete('/:id', authMiddleware, allowRoles('admin'), userController.delete)

module.exports = router