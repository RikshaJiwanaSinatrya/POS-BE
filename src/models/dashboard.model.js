const db = require('../config/db');

// --- KODINGAN APRILIA (Diperbaiki Typo SQL-nya) ---
exports.getDailyOrders = async () => {
    const [rows] = await db.query(`
        SELECT DATE_FORMAT(dates.tanggal, '%Y-%m-%d') as tanggal, COALESCE(SUM(o.total_harga), 0) as total_order
        FROM (
            SELECT CURDATE() as tanggal
            UNION ALL SELECT CURDATE() - INTERVAL 1 DAY
            UNION ALL SELECT CURDATE() - INTERVAL 2 DAY
            UNION ALL SELECT CURDATE() - INTERVAL 3 DAY
            UNION ALL SELECT CURDATE() - INTERVAL 4 DAY
            UNION ALL SELECT CURDATE() - INTERVAL 5 DAY
            UNION ALL SELECT CURDATE() - INTERVAL 6 DAY
        ) dates
        LEFT JOIN orders o ON DATE(o.created_at) = dates.tanggal
        GROUP BY dates.tanggal
        ORDER BY dates.tanggal ASC
    `);
    return rows;
};

exports.getOrdersStatusCount = async () => {
    const [rows] = await db.query(`
        SELECT status_pesanan, COUNT(id) as total
        FROM orders 
        GROUP BY status_pesanan
    `);
    return rows;
};

// --- KODINGAN AHMAD ---
// Checklist 1 & Tugas Omzet Awal: Data Ringkasan Dashboard
exports.getSummary = async () => {
    // 1. Menghitung Total Orderan
    const [rowsTotal] = await db.query('SELECT COUNT(id) as total FROM orders');
    const totalOrderan = rowsTotal[0].total || 0;
    
    // 2. Menghitung Omzet Hari Ini
    const [rowsOmzet] = await db.query('SELECT SUM(total_harga) as omzet FROM orders WHERE DATE(created_at) = CURDATE()');
    const omzetHarian = rowsOmzet[0].omzet || 0;
    
    // 3. Menghitung Total Pesanan yang "Selesai"
    const [rowsSelesai] = await db.query('SELECT COUNT(id) as total FROM orders WHERE status_pesanan = "Selesai"');
    const totalSelesai = rowsSelesai[0].total || 0;
    
    // 4. Menghitung Rata-rata Nilai Orderan
    const [rowsRata] = await db.query('SELECT AVG(total_harga) as rata_rata FROM orders');
    const rataRataOrderan = rowsRata[0].rata_rata || 0;

    // 5. Kalkulasi Persentase Selesai
    const persentase = totalOrderan === 0 ? 0 : Math.round((totalSelesai / totalOrderan) * 100);

    // 6. TUGAS BARU: Cash Omzet Awal (Modal Laci Kasir)
    // Kita set default statis Rp 100.000 untuk tampilan awal kasir
    const cashOmzetAwal = 100000;

    return {
        cash_omzet_awal: cashOmzetAwal, // Output baru untuk cash awal
        total_order: totalOrderan,
        omzet_harian: Number(omzetHarian),
        persentase_selesai: persentase,
        rata_rata_orderan: Math.round(Number(rataRataOrderan))
    };
};

// Top Menus: Menu Terlaris
exports.getTopMenus = async () => {
    const [rows] = await db.query('SELECT items FROM orders WHERE items IS NOT NULL AND items != "[]"');
    const countMap = new Map();
    for (const row of rows) {
        let items;
        try { items = JSON.parse(row.items); } catch { continue; }
        if (!Array.isArray(items)) continue;
        for (const item of items) {
            const name = item.nama_produk || item.produk_id || '';
            if (!name) continue;
            const qty = Math.max(1, Number(item.jumlah) || 0);
            countMap.set(name, (countMap.get(name) || 0) + qty);
        }
    }
    return [...countMap.entries()]
        .map(([nama_produk, total_terjual]) => ({ nama_produk, total_terjual }))
        .sort((a, b) => b.total_terjual - a.total_terjual)
        .slice(0, 5);
};

// Checklist 4: Tabel Order Terbaru (Dikembalikan lagi kodingannya)
exports.getRecentOrders = async () => {
    const [rows] = await db.query(`
        SELECT orders.id, orders.nama_pelanggan, orders.total_harga, orders.status_pesanan
        FROM orders
        ORDER BY orders.created_at DESC
        LIMIT 5
    `);
    return rows;
};