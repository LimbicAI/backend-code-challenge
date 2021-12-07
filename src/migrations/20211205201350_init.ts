import { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.createTable("users", t => {
    t.uuid("id")
      .notNullable()
      .defaultTo(knex.raw("gen_random_uuid()"))
      .primary();
    t.text("handle").notNullable().unique();
  });
  await knex.schema.createTable("posts", t => {
    t.uuid("id")
      .notNullable()
      .defaultTo(knex.raw("gen_random_uuid()"))
      .primary();
    t.text("title").notNullable();
    t.text("text").notNullable();
    t.uuid("author_id").notNullable();
    t.timestamps(true, true);

    t.foreign("author_id").references("users.id");
  });
}
export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists("posts");
  await knex.schema.dropTableIfExists("users");
}
