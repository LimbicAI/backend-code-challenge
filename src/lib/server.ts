import { ApolloServer, gql } from "apollo-server";
import knex from "../knex";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type User {
    id: ID!
    handle: String!
    posts: [Post!]!
  }

  type Post {
    title: String!
    text: String!
    author: User!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
  }

  type Mutation {
    addUser(handle: String!): User
    addPost(title: String!, text: String!, user: ID!): Post
  }
`;

type uuid = string;

interface User {
  id: uuid;
  handle: string;
}

interface Post {
  id: uuid;
  title: string;
  text: string;
  author: User;
}

type PostRow = Omit<Post, "author"> & {
  author_id: uuid;
};

type PostResolver = Omit<Post, "author"> & {
  author: { id: uuid };
};

interface Resolvers {
  Query: {
    users: () => Promise<User[]>;
    posts: () => Promise<PostResolver[]>;
  };
  Mutation: {
    addUser: (parent: any, args: { handle: string }) => Promise<User>;
    addPost: (
      parent: any,
      args: { title: string; text: string; user: uuid }
    ) => Promise<Post>;
  };
  [key: string]: any;
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers: Resolvers = {
  Query: {
    users: () => knex("users"),
    posts: async () => {
      const posts = await knex<PostRow>("posts");
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        text: post.text,
        author: {
          id: post.author_id,
        },
      }));
    },
  },
  Mutation: {
    addUser: async (_: any, { handle }: { handle: string }) => {
      const res = await knex("users").insert({ handle }).returning("*");
      return res[0];
    },
    addPost: async (_, { title, text, user }) => {
      const res = await knex("posts")
        .insert({ title, text, user })
        .returning("*");
      return res[0];
    },
  },
};

export default async function server() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const url = await server.listen();
  console.log(`🚀  Server ready at ${url}`);

  return server;
}
