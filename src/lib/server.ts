import { ApolloError, ApolloServer, gql } from "apollo-server";
import knex from "../knex";
import { Mutation, postResolver, Query, userResolver } from "./resolvers";

/**
 * Schema for the graphql server, composed of users and posts and the relationship
 * between the 2. Allows creating users and posts for any user.
 */
const typeDefs = gql`
  type User {
    id: ID!
    handle: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    text: String!
    author: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
  }

  type Mutation {
    addUser(handle: String!): User
    addPost(title: String!, text: String!, author: ID!): Post
  }
`;

/**
 * Creates a new apollo server. To help with testing the server is not listening
 * to connections yet and `listen` needs to be called on the returned value.
 * @returns Apollo server
 */
export default async function server() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation, User: userResolver, Post: postResolver },
    formatError: err => {
      if (
        process.env.NODE_ENV === "production" &&
        err.extensions.code === "INTERNAL_SERVER_ERROR"
      ) {
        // A internal error, as the user cannot do anything about it, lets log it and
        // send a generic error to the frontend
        console.error(err);

        return new ApolloError(
          "Internal Server Error",
          "INTERNAL_SERVER_ERROR"
        );
      }

      return err;
    },
    context: {
      knex,
    },
  });

  return server;
}
