const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

router.get('/charts', authMiddleware, allowRoles('admin'), dashboardController.getChartData);
router.get('/summary', authMiddleware, allowRoles('admin'), dashboardController.getSummaryData);
router.get('/top-menus', authMiddleware, allowRoles('admin'), dashboardController.getTopMenus);

module.exports = router;

