const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/', authMiddleware, orderController.createOrder)
router.get('/', authMiddleware, orderController.getOrder)
router.get('/:id', authMiddleware, orderController.getOrderById)
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus)
router.delete('/:id', authMiddleware, orderController.deleteOrder)

module.exports = router