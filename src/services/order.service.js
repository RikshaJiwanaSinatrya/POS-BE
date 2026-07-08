const orderModel = require('../models/order.model');
const produkModel = require('../models/produk.model');
const crypto = require('crypto');

const resolveProdukId = async (identifier) => {
    if (!identifier) return null;
    const byId = await produkModel.getById(identifier);
    if (byId) return byId.id;

    const byName = await produkModel.getByName(identifier);
    if (byName) return byName.id;

    return null;
};

exports.createData = async (data) => {
    if (!data) throw Object.assign(new Error('Body request kosong'), { statusCode: 400 });
    if (!data.nama_pelanggan) throw Object.assign(new Error('Nama pelanggan wajib diisi'), { statusCode: 400 });
    if (!data.total_harga && data.total_harga !== 0) throw Object.assign(new Error('Total harga wajib diisi'), { statusCode: 400 });

    const items = Array.isArray(data.items) ? data.items : [];

    if (!items.length) throw Object.assign(new Error('Items tidak boleh kosong'), { statusCode: 400 });
    if (!items[0].produk_id) throw Object.assign(new Error('Produk ID item pertama kosong'), { statusCode: 400 });
    if (!items[0].jumlah) throw Object.assign(new Error('Jumlah item pertama kosong'), { statusCode: 400 });

    const resolvedItems = [];
    for (const item of items) {
        const produkId = await resolveProdukId(item.produk_id);
        if (!produkId) {
            throw Object.assign(
                new Error(`Produk "${item.produk_id}" tidak ditemukan di database`),
                { statusCode: 400 }
            );
        }
        const produk = await produkModel.getById(produkId);
        if (!produk) {
            throw Object.assign(
                new Error(`Produk dengan ID "${produkId}" tidak ditemukan`),
                { statusCode: 400 }
            );
        }
        const stokTersedia = produk.stok || 0;
        const diminta = Number(item.jumlah);
        if (stokTersedia < diminta) {
            throw Object.assign(
                new Error(`Stok "${produk.nama_produk}" tidak mencukupi (tersedia: ${stokTersedia}, diminta: ${diminta})`),
                { statusCode: 400 }
            );
        }
        resolvedItems.push({ produk_id: produkId, nama_produk: produk.nama_produk, jumlah: diminta });
    }

    for (const item of resolvedItems) {
        const produk = await produkModel.getById(item.produk_id);
        await produkModel.updateStock(item.produk_id, (produk.stok || 0) - item.jumlah);
    }

    const id = crypto.randomUUID();

    const newOrder = {
        id,
        nama_pelanggan: data.nama_pelanggan,
        produk_id: resolvedItems[0].produk_id,
        jumlah: resolvedItems[0].jumlah,
        total_harga: data.total_harga,
        items: JSON.stringify(resolvedItems),
        status_pesanan: "Diproses"
    }

    await orderModel.create(newOrder);

    return {
        id,
        nama_pelanggan: data.nama_pelanggan,
        total_harga: data.total_harga,
        items: resolvedItems,
        status_pesanan: "Diproses"
    };
}
