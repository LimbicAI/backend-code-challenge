import knex from "../knex";
import { join } from "path";

import gql from "graphql-tag";
import serverFactory from "../lib/server";

const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

beforeEach(async () => {
  // before each test drop all database
  await knex.schema.dropSchemaIfExists("public", true);
  await knex.schema.createSchema("public");
  await knex.migrate.latest({
    directory: join(__dirname, `../migrations`),
  });
});

test("creates a user", async () => {
  console.log("begin");
  const createUserQuery = gql`
    mutation CreateUser($handle: String!) {
      createUser(handle: $handle) {
        id
        handle
      }
    }
  `;

  const server: any = serverFactory();

  const res = await server.executeOperation({
    query: createUserQuery,
    variables: { handle: "user1" },
  });

  expect(res.id).toMatch(UUID_REGEX);
  expect(res.handle).toBe("user1");
});

afterAll(async () => {
  knex.destroy();
});
