exports.up = function(knex) {
    return knex.schema.table('orders', function(table) {
        table.json('items').nullable().after('total_harga');
    });
};

exports.down = function(knex) {
    return knex.schema.table('orders', function(table) {
        table.dropColumn('items');
    });
};
