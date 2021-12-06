import knex from "../knex";
import { join } from "path";

export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

export async function resetDB() {
  // drop public schema as a shortcut to drop everything in the db
  await knex.schema.dropSchemaIfExists("public", true);
  await knex.schema.createSchema("public");
  await knex.migrate.latest({
    directory: join(__dirname, `../migrations`),
  });
}
