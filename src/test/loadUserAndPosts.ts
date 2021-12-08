import gql from "graphql-tag";
import knex from "../knex";
import serverFactory from "../lib/server";
import { PostRow, UserRow } from "../lib/types";
import { resetDB } from "./helpers";

beforeEach(resetDB);

test("load all users and posts", async () => {
  // lets insert a user and some posts out of band
  const [userId] = await knex<UserRow>("users")
    .insert({ handle: "user1" })
    .returning("id");

  const [post1Id, post2Id] = await knex<PostRow>("posts")
    .insert([
      { title: "Title 1", text: "Text 1", author_id: userId },
      { title: "Title 2", text: "Text 2", author_id: userId },
    ])
    .returning("id");

  const query = gql`
    query LoadUserAndPosts($userId: ID!) {
      user(id: $userId) {
        id
        handle
        posts {
          id
          title
          text
        }
      }
    }
  `;

  const server = await serverFactory();

  const { data } = await server.executeOperation({
    query,
    variables: { userId },
  });

  expect(data).toMatchObject({
    user: {
      id: userId,
      handle: "user1",
      posts: [
        { id: post1Id, title: "Title 1", text: "Text 1" },
        { id: post2Id, title: "Title 2", text: "Text 2" },
      ],
    },
  });
});

afterAll(() => knex.destroy());
