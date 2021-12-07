import knex from "../knex";
import { HandleAlreadyInUseError, UserNotFoundError } from "./errors";
import { uuid, Post, PostRow, User, UserRow } from "./types.d";

export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

interface Query {
  users: () => Promise<User[]>;
  user: (parent: any, { id }: { id: string }) => Promise<User | undefined>;
  posts: () => Promise<PostRow[]>;
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
export const Query: Query = {
  users: () => knex("users"),
  user: (_, { id }) => knex<UserRow>("users").where({ id }).first(),
  posts: async () => await knex<PostRow>("posts"),
};

interface Mutation {
  addUser: (parent: any, args: { handle: string }) => Promise<User>;
  addPost: (
    parent: any,
    args: { title: string; text: string; author: uuid }
  ) => Promise<PostRow>;
}

export const Mutation: Mutation = {
  addUser: async (_: any, { handle }: { handle: string }) => {
    try {
      const res = await knex("users").insert({ handle }).returning("*");
      return res[0];
    } catch (err: any) {
      if (err.constraint === "users_handle_unique") {
        throw new HandleAlreadyInUseError(
          `Handle "${handle}" is already is use by another user`
        );
      }

      throw err;
    }
  },
  addPost: async (_, { title, text, author }) => {
    if (!UUID_REGEX.test(author)) {
      throw new Error("Author id must be a UUID");
    }

    try {
      const [postRow] = await knex("posts")
        .insert({ title, text, author_id: author })
        .returning("*");
      return postRow;
    } catch (err: any) {
      if (err.constraint === "posts_author_id_foreign") {
        throw new UserNotFoundError("User with id ${author} was not found");
      }
      throw err;
    }
  },
};

type UserResolver = {
  posts: (parent: { id: string }) => Promise<PostRow[]>;
};

export const userResolver: UserResolver = {
  posts: ({ id }) => knex<PostRow>("posts").where({ author_id: id }),
};

type PostResolver = {
  author: (parent: { author_id: string }) => Promise<UserRow | undefined>;
};

export const postResolver: PostResolver = {
  author: ({ author_id }) =>
    knex<UserRow>("users").where({ id: author_id }).first(),
};
