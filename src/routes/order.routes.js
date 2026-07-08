const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const allowRoles = require('../middlewares/role.middleware')

router.post('/', authMiddleware, allowRoles('kasir'), orderController.createOrder)
router.get('/', authMiddleware, allowRoles('kasir', 'admin'), orderController.getOrder)
router.get('/:id', authMiddleware, allowRoles('kasir', 'admin'), orderController.getOrderById)
router.patch('/:id/status', authMiddleware, allowRoles('kasir'), orderController.updateOrderStatus)
router.delete('/:id', authMiddleware, allowRoles('kasir'), orderController.deleteOrder)

module.exports = router