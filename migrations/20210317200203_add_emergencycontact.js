exports.up = function(knex, Promise) {
  knex.schema.alterTable('fields', function(t) {
    t.integer('emergencyContact');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropColumn(emergencyContact);
};