exports.up = function(knex, Promise) {
  return knex.schema.createTable("fields", function(table) {
    table.string("id").increment().primary();
    table.string("firstName").notNullable();
    table.string("lastName").notNull();
    table.string("dob").notNull();
    table.string("email");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("fields");
};
