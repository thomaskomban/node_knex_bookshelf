exports.up = function(knex, Promise) {
  knex.schema.alterTable('fields', function(table) {
    table.integer('id').increment().primary()
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropPrimary(id);
};