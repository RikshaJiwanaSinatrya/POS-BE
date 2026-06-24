const db = require('../config/db');

exports.create = async (data) => {
    await db.query(
        'INSERT INTO orders (id, nama_pelanggan, produk_id, jumlah, total_harga, items, status_pesanan) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.id, data.nama_pelanggan, data.produk_id, data.jumlah, data.total_harga, data.items, data.status_pesanan]
    );
};

exports.getAll = async () => {
    const [rows] = await db.query(`
        SELECT
            orders.id,
            orders.nama_pelanggan,
            produk.nama_produk,
            orders.jumlah,
            orders.total_harga,
            orders.items,
            orders.status_pesanan,
            orders.created_at
        FROM orders
        JOIN produk ON orders.produk_id = produk.id
        ORDER BY orders.created_at DESC
    `);
    return rows.map(row => ({
        ...row,
        items: row.items ? JSON.parse(row.items) : null
    }));
}

exports.getById = async (id) => {
    const [rows] = await db.query(`
        SELECT
            orders.id,
            orders.nama_pelanggan,
            orders.total_harga,
            orders.items,
            orders.status_pesanan,
            orders.created_at
        FROM orders
        WHERE orders.id = ?
    `, [id]);
    if (!rows[0]) return null;
    return {
        ...rows[0],
        items: rows[0].items ? JSON.parse(rows[0].items) : []
    };
}
