const orderService = require('../services/order.service');
const orderModel = require('../models/order.model');

exports.createOrder = async (req, res, next) => {
    try {
        console.log('REQ BODY:', JSON.stringify(req.body, null, 2));
        console.log('Calling orderService.createData...');
        const order = await orderService.createData(req.body);
        console.log('SUCCESS, returning:', JSON.stringify(order));
        res.status(201).json({
            status: 'success',
            data: order
        })
    } catch (error) {
        console.error('ORDER ERROR:', error);
        console.error('STACK:', error.stack);
        next(error)
    }
}

exports.getOrder = async (req, res, next) => {
    try {
        const orders = await orderModel.getAll()
        res.status(200).json({
            status: 'success',
            message: 'Berhasil Mengambil data pesanan',
            data: orders
        })
    } catch (error) {
        next(error)
    }
}