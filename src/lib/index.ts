import { join } from "path";
import knex from "../knex";
import serverFactory from "./server";

async function init() {
  if (
    process.env.MIGRATE_LATEST &&
    /^true$/i.test(process.env.MIGRATE_LATEST)
  ) {
    await knex.migrate.latest({
      directory: join(__dirname, `../migrations`),
    });
  }

  const server = await serverFactory();
  const { url } = await server.listen();
  console.log(`🚀  Server ready at ${url}`);
}

const delayStart = process.env.DELAY_START_MS
  ? parseInt(process.env.DELAY_START_MS)
  : 0;

if (delayStart) {
  setTimeout(init, delayStart);
} else {
  init();
}
