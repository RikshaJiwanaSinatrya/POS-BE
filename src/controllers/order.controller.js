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

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status_pesanan } = req.body;
    const validStatuses = ['Proses', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
    if (!validStatuses.includes(status_pesanan)) {
      return res.status(400).json({ status: 'error', message: 'Status tidak valid' });
    }
    const result = await orderModel.updateStatus(id, status_pesanan);
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Order tidak ditemukan' });
    }
    res.json({ status: 'success', message: 'Status order diperbarui' });
  } catch (error) {
    next(error);
  }
}

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderModel.deleteById(id);
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Order tidak ditemukan' });
    }
    res.json({ status: 'success', message: 'Order berhasil dihapus' });
  } catch (error) {
    next(error);
  }
}

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderModel.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order tidak ditemukan' });
    }
    res.json({ status: 'success', data: order });
  } catch (error) {
    next(error);
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