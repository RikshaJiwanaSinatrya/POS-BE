const db = require('../config/db');

const resolveItemNames = async (items) => {
    if (!items || !items.length) return items;
    const ids = [...new Set(items.map(i => i.produk_id))];
    const [rows] = await db.query(
        'SELECT id, nama_produk FROM produk WHERE id IN (?)', [ids]
    );
    const nameMap = Object.fromEntries(rows.map(r => [r.id, r.nama_produk]));
    return items.map(i => ({ ...i, nama_produk: i.nama_produk || nameMap[i.produk_id] || '' }));
};

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
    const mapped = rows.map(row => ({
        ...row,
        items: row.items ? JSON.parse(row.items) : null
    }));
    for (const row of mapped) {
        if (row.items) {
            row.items = await resolveItemNames(row.items);
        }
    }
    return mapped;
}

exports.updateStatus = async (id, status_pesanan) => {
  const [result] = await db.query(
    'UPDATE orders SET status_pesanan = ? WHERE id = ?',
    [status_pesanan, id]
  );
  return result.affectedRows > 0;
}

exports.deleteById = async (id) => {
  const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
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
    const row = rows[0];
    const items = row.items ? JSON.parse(row.items) : [];
    return {
        ...row,
        items: await resolveItemNames(items)
    };
}
