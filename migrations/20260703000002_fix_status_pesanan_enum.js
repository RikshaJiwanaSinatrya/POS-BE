exports.up = function(knex) {
    return knex.schema.raw(
        "ALTER TABLE orders MODIFY COLUMN status_pesanan ENUM('Proses','Diproses','Dikirim','Selesai','Dibatalkan') DEFAULT 'Proses'"
    );
};

exports.down = function(knex) {
    return knex.schema.raw(
        "ALTER TABLE orders MODIFY COLUMN status_pesanan ENUM('Proses','Kirim','Selesai','Dibatalkan') DEFAULT 'Proses'"
    );
};
