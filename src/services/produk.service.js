const produkModel = require('../models/produk.model');
const crypto = require('crypto'); //Untuk membuat sebuah id unik

exports.createData = async (data) => {
    if (!data.nama_produk || !data.harga_produk || !data.jenis_produk) {
        const error = new Error('INVALID_PAYLOAD');
        error.statusCode = 400;
        throw error;
    }

    const existingProduk = await produkModel.getByName(data.nama_produk);
    if (existingProduk) {
        const error = new Error('Produk duplikat! Nama produk ini sudah ada di database.');
        error.statusCode = 409;
        throw error;
    }

    const id = crypto.randomUUID();

    const newData = {
        id,
        nama_produk: data.nama_produk,
        harga_produk: data.harga_produk,
        jenis_produk: data.jenis_produk,
        foto_produk: null,
        stok: data.stok || 0
    }

    await produkModel.create(newData);
    return newData;
}

exports.getAllData = async () => {
    const produk = await produkModel.getAll();
    return produk;
}

exports.updateData = async (id, data) => {
  const produk = await produkModel.getById(id);
  if (!produk) {
    const error = new Error('Produk tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  const updateData = {
    nama_produk: data.nama_produk || produk.nama_produk,
    harga_produk: data.harga_produk || produk.harga_produk,
    jenis_produk: data.jenis_produk || produk.jenis_produk,
    foto_produk: null,
    stok: data.stok !== undefined ? data.stok : produk.stok
  };
  await produkModel.update(id, updateData);
  return { id, ...updateData };
}

exports.getDataById = async (id) => {
  const produk = await produkModel.getById(id);
  if (!produk) {
    const error = new Error('Produk tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return produk;
}

exports.deleteData = async (id) => {
    const produk = await produkModel.getById(id);
    if (!produk) {
        const error = new Error('Produk tidak ditemukan');
        error.statusCode = 404;
        throw error;
    }

    await produkModel.deleteById(id);
    return { id };
}