import gql from "graphql-tag";
import serverFactory from "../lib/server";
import { resetDB, UUID_REGEX } from "./helpers";
import knex from "../knex";

beforeEach(resetDB);

test("creates a user", async () => {
  const createUserMutation = gql`
    mutation AddUser($handle: String!) {
      addUser(handle: $handle) {
        id
        handle
      }
    }
  `;

  const server = await serverFactory();

  const { data } = await server.executeOperation({
    query: createUserMutation,
    variables: { handle: "user1" },
  });

  expect(data && data.addUser.id).toMatch(UUID_REGEX);
  expect(data && data.addUser.handle).toBe("user1");
});

afterAll(() => knex.destroy());
