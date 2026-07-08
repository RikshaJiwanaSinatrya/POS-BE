const db = require('../config/db')

exports.getAll = async () => {
    const [rows] = await db.query(
        'SELECT * FROM produk WHERE deleted_at = "0000-00-00 00:00:00"'
    )
    return rows
}

exports.getById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM produk WHERE id = ? AND deleted_at = "0000-00-00 00:00:00"', [id]
    )
    return rows[0]
}

exports.getByName = async (nama_produk) => {
    const [rows] = await db.query(
        'SELECT * FROM produk WHERE nama_produk = ? AND deleted_at = "0000-00-00 00:00:00"', [nama_produk]
    )
    return rows[0]
}

exports.create = async (data) => {
    await db.query(
        'INSERT INTO produk (id, nama_produk, harga_produk, jenis_produk, foto_produk, stok) VALUES (?, ?, ?, ?, ?, ?)',
        [data.id, data.nama_produk, data.harga_produk, data.jenis_produk, data.foto_produk, data.stok || 0]
    )
}

exports.update = async (id, data) => {
  await db.query(
    'UPDATE produk SET nama_produk = ?, harga_produk = ?, jenis_produk = ?, foto_produk = ?, stok = ? WHERE id = ?',
    [data.nama_produk, data.harga_produk, data.jenis_produk, data.foto_produk, data.stok, id]
  )
}

exports.updateStock = async (id, stok) => {
    await db.query(
        'UPDATE produk SET stok = ? WHERE id = ?', [stok, id]
    )
}

exports.deleteById = async (id) => {
    await db.query(
        'UPDATE produk SET deleted_at = NOW() WHERE id = ?',
        [id]
    )
}
