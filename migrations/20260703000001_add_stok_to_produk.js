exports.up = function(knex) {
    return knex.schema.table('produk', function(table) {
        table.integer('stok').notNullable().defaultTo(0).after('foto_produk');
    });
};

exports.down = function(knex) {
    return knex.schema.table('produk', function(table) {
        table.dropColumn('stok');
    });
};
