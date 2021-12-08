import { Knex } from "knex";
import { HandleAlreadyInUseError, UserNotFoundError } from "./errors";
import { uuid, Post, PostRow, User, UserRow } from "./types.d";

// This file contains the resolvers for the the type in the graphql server
// Apollo server resolvers are documented here
// https://www.apollographql.com/docs/apollo-server/data/resolvers/
//
// There are several approaches that can be taken with resolvers, each type
// typically has it's own resolver collection with one resolver function for
// each field in the type. Apollo server also provides default resolvers, for
// instance if given an object with properties as a user, the default resolver
// will load the value with the same key as the field being resolved, that helps
// limit boilerplate.
//
// Here due to the size of the project and database, we take a maximalist approach
// where it's the responsibility of the parent to load all scalar values of the
// child and the child will take responsibility for loading any complex relationships.
// Example: the users query will load all users with their scalar properties, the user
// then has one relationship to posts, and will be the User resolver responsibility
// to load all of the users posts and their scalar properties, then the Post resolver will
// load the post author and so on and so forth.
//
// This is a good compromise for this project that issues a DB call for each object/list
// of objects instead of one DB call for each field in the worst case or the Dataloader
// approach that issues one DB call for each object type but adds complexity.

//Regex to mach the format of a UUID
const UUID_REGEX =
  /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i;

interface Context {
  /**
   * Database connection coming from context
   */
  knex: Knex;
}

/**
 * Main query type allowing the user to load all users, all posts and a user by id
 */
interface Query {
  users: (parent: {}, args: {}, ctx: Context) => Promise<User[]>;
  user: (
    parent: {},
    { id }: { id: string },
    ctx: Context
  ) => Promise<User | undefined>;
  posts: (parent: {}, args: {}, ctx: Context) => Promise<PostRow[]>;
}

export const Query: Query = {
  users: (_, __, { knex }) => knex("users"),
  user: (_, { id }, { knex }) => knex<UserRow>("users").where({ id }).first(),
  posts: (_, __, { knex }) => knex<PostRow>("posts"),
};

/**
 * Mutation type contains both mutations in the server, add user and and post
 */
interface Mutation {
  addUser: (
    parent: {},
    args: { handle: string },
    ctx: Context
  ) => Promise<User>;
  addPost: (
    parent: {},
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
      // check for the constraint error from the db, to give the user a
      // a business logic error rather than a generic db error
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
      // check for the constraint error from the db, to give the user a
      // a business logic error rather than a generic db error
      if (err.constraint === "posts_author_id_foreign") {
        throw new UserNotFoundError(`User with id "${author}" was not found`);
      }
      throw err;
    }
  },
};

type UserResolver = {
  posts: (parent: UserRow, args: {}, ctx: Context) => Promise<PostRow[]>;
};

export const userResolver: UserResolver = {
  // User resolver loads only the complex relationships
  // all other fields are handled by the default resolvers
  // see top of the file for more in depth explanation
  posts: ({ id }, _, { knex }) =>
    knex<PostRow>("posts").where({ author_id: id }),
};

type PostResolver = {
  author: (
    parent: PostRow,
    args: {},
    ctx: Context
  ) => Promise<UserRow | undefined>;
};

export const postResolver: PostResolver = {
  // Post resolver loads only the complex relationships
  // all other fields are handled by the default resolvers
  // see top of the file for more in depth explanation
  author: ({ author_id }, _, { knex }) =>
    knex<UserRow>("users").where({ id: author_id }).first(),
};
