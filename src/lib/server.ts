import { ApolloError, ApolloServer, gql } from "apollo-server";
import { Query, Mutation, userResolver, postResolver } from "./resolvers";

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
  });

  const { url } = await server.listen();
  console.log(`🚀  Server ready at ${url}`);

  return server;
}
