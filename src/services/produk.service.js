const produkModel = require('../models/produk.model');
const crypto = require('crypto'); //Untuk membuat sebuah id unik

exports.createData = async (data, file) => {
    // Mengecek apakah ada data wajib yang kosonh
    if (!data.nama_produk || !data.harga_produk || !data.jenis_produk) {
        const error = new Error('INVALID_PAYLOAD');
        error.statusCode = 400;
        throw error;
    }

    // Menguji TS3: mencegah supaya produk duplikat
    const existingProduk = await produkModel.getByName(data.nama_produk);
    if (existingProduk) {
        const error = new Error('Produk duplikat! Nama produk ini sudah ada di database.');
        error.statusCode = 409; // Conflict
        throw error;
    }

    // Menyimpan ID unik dan file foto
    const id = crypto.randomUUID();

    // Kalo ada file foto yang dikirim, ambil nama filenya. Jika tidak, biarkan null
    const foto_produk = file ? file.filename : null;

    const newData = {
        id,
        nama_produk: data.nama_produk,
        harga_produk: data.harga_produk,
        jenis_produk: data.jenis_produk,
        foto_produk: foto_produk
    }

    // Simpan data ke database
    await produkModel.create(newData);
    return newData;
}

exports.getAllData = async () => {
    const produk = await produkModel.getAll();
    return produk;
}

exports.updateData = async (id, data, file) => {
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
    foto_produk: file ? file.filename : produk.foto_produk
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