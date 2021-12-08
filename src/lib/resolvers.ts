import { Knex } from "knex";
import { HandleAlreadyInUseError, UserNotFoundError } from "./errors";
import { uuid, Post, PostRow, User, UserRow } from "./types.d";

const UUID_REGEX =
  /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;

interface Context {
  knex: Knex;
}

interface Query {
  users: (parent: any, args: any, ctx: Context) => Promise<User[]>;
  user: (
    parent: any,
    { id }: { id: string },
    ctx: Context
  ) => Promise<User | undefined>;
  posts: (parent: any, args: any, ctx: Context) => Promise<PostRow[]>;
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
export const Query: Query = {
  users: (_, __, { knex }) => knex("users"),
  user: (_, { id }, { knex }) => knex<UserRow>("users").where({ id }).first(),
  posts: (_, __, { knex }) => knex<PostRow>("posts"),
};

interface Mutation {
  addUser: (
    parent: any,
    args: { handle: string },
    ctx: Context
  ) => Promise<User>;
  addPost: (
    parent: any,
    args: { title: string; text: string; author: uuid },
    ctx: Context
  ) => Promise<PostRow>;
}

export const Mutation: Mutation = {
  addUser: async (_, { handle }: { handle: string }, { knex }) => {
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
  addPost: async (_, { title, text, author }, { knex }) => {
    if (!UUID_REGEX.test(author)) {
      throw new Error("Author id must be a UUID");
    }

    try {
      const [postRow] = await knex<PostRow>("posts")
        .insert({ title, text, author_id: author })
        .returning("*");
      return postRow;
    } catch (err: any) {
      if (err.constraint === "posts_author_id_foreign") {
        throw new UserNotFoundError(`User with id "${author}" was not found`);
      }
      throw err;
    }
  },
};

type UserResolver = {
  posts: (parent: { id: string }, args: {}, ctx: Context) => Promise<PostRow[]>;
};

export const userResolver: UserResolver = {
  posts: ({ id }, _, { knex }) =>
    knex<PostRow>("posts").where({ author_id: id }),
};

type PostResolver = {
  author: (
    parent: { author_id: string },
    args: {},
    ctx: Context
  ) => Promise<UserRow | undefined>;
};

export const postResolver: PostResolver = {
  author: ({ author_id }, _, { knex }) =>
    knex<UserRow>("users").where({ id: author_id }).first(),
};
