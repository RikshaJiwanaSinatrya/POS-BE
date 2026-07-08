const produkService = require('../services/produk.service');

exports.createProduk = async (req, res) => {
    try {
        const produk = await produkService.createData(req.body);
        
        res.status(201).json({
            status: 'success',
            message: 'produk berhasil ditambah',
            data: produk
        });
    } catch (error) {
        res.status(error.status || 500).json({
            status: 'error',
            statusCode: error.statusCode || 500,
            message: error.message || 'Terjadi kesalahan pada server'
        });
    };
}

exports.getAllProduk = async (req, res) => {
    try {
        const produk = await produkService.getAllData();
        res.json({
            status: 'success',
            data: produk
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            statusCode: error.statusCode || 500,
            message: error.message || 'Terjadi kesalahan pada server'
        });
    }
}

exports.updateProduk = async (req, res) => {
  try {
    const produk = await produkService.updateData(req.params.id, req.body);
    res.json({
      status: 'success',
      message: 'Produk berhasil diperbarui',
      data: produk
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      statusCode: error.statusCode || 500,
      message: error.message || 'Terjadi kesalahan pada server'
    });
  }
}

exports.getProdukById = async (req, res) => {
  try {
    const produk = await produkService.getDataById(req.params.id);
    res.json({ status: 'success', data: produk });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'error',
      statusCode: error.statusCode || 500,
      message: error.message || 'Terjadi kesalahan pada server'
    });
  }
}

exports.deleteProduk = async (req, res) => {
    try {
        const { id } = req.params;
        await produkService.deleteData(id);
        res.json({
            status: 'success',
            message: 'Produk berhasil dihapus'
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            statusCode: error.statusCode || 500,
            message: error.message || 'Terjadi kesalahan pada server'
        });
    }
}