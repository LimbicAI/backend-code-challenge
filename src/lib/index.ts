import { join } from "path";
import knex from "../knex";
import serverFactory from "./server";

/**
 * Init function starts the server and optionally migrates the DB to the current
 * version
 */
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

// Parse the ms to delay the start of the server from the environment
const delayStart = process.env.DELAY_START_MS
  ? parseInt(process.env.DELAY_START_MS)
  : 0;

// Start the server immediately or delayed based on the configuration
if (delayStart) {
  setTimeout(init, delayStart);
} else {
  init();
}
