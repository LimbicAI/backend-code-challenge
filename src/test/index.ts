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
    mutation AddUser($handle: String!) {
      addUser(handle: $handle) {
        id
        handle
      }
    }
  `;

  const server = await serverFactory();

  const { data } = await server.executeOperation({
    query: createUserQuery,
    variables: { handle: "user1" },
  });

  expect(data && data.addUser.id).toMatch(UUID_REGEX);
  expect(data && data.addUser.handle).toBe("user1");

  await server.stop();
});

afterAll(async () => {
  knex.destroy();
});
