import gql from "graphql-tag";
import knex from "../knex";
import serverFactory from "../lib/server";
import { UserRow } from "../lib/types";
import { resetDB, UUID_REGEX } from "./helpers";

beforeEach(resetDB);

test("create a post for an existing user", async () => {
  // lets insert a user out of band
  const res = await knex<UserRow>("users")
    .insert({ handle: "user1" })
    .returning("id");

  const [userId] = res;

  const createPostMutation = gql`
    mutation AddPost($title: String!, $text: String!, $userId: ID!) {
      addPost(title: $title, text: $text, author: $userId) {
        id
        title
        text
        author {
          id
          handle
        }
      }
    }
  `;
  const server = await serverFactory();

  const { data, errors } = await server.executeOperation({
    query: createPostMutation,
    variables: { title: "Title", text: "Text", userId },
  });

  expect(data).toMatchObject({
    addPost: {
      id: expect.stringMatching(UUID_REGEX),
      title: "Title",
      text: "Text",
      author: {
        id: userId,
        handle: "user1",
      },
    },
  });
});

afterAll(() => knex.destroy());
