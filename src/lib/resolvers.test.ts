import { Mutation, postResolver, Query, userResolver } from "./resolvers";

/**
 * Creates a knex db connection mock that has a predetermined result
 * either succeeding or failing with the passed arguments.
 *
 * @param res if not null this will be returned with the query is awaited
 * @param err if res is null then this error will be thrown when the query is awaited
 * @returns knex function mock, as a promise that can be awaited
 */
function knexMock(res: any, err: any = null): any {
  const knex: any = res ? Promise.resolve(res) : Promise.reject(err);

  knex.where = jest.fn().mockReturnThis();
  knex.select = jest.fn().mockReturnThis();
  knex.first = jest.fn().mockReturnThis();
  knex.insert = jest.fn().mockReturnThis();
  knex.returning = jest.fn().mockReturnThis();

  return jest.fn(() => knex);
}

describe("Query", () => {
  describe("load users", () => {
    it("loads users", async () => {
      const users = [
        { handle: "1", id: "1" },
        { handle: "2", id: "1" },
      ];
      const res = await Query.users({}, {}, { knex: knexMock(users) });

      expect(users).toEqual(res);
    });
  });

  describe("load user by id", () => {
    it("returns to user", async () => {
      const user = { id: "1", handle: "1" };

      const res = await Query.user({}, { id: "1" }, { knex: knexMock(user) });

      expect(res).toEqual(user);
    });
  });

  it("load posts", async () => {
    const posts = [
      { text: "1", title: "1", author_id: "1" },
      { text: "2", title: "2", author_id: "2" },
    ];
    const res = await Query.posts({}, {}, { knex: knexMock(posts) });

    expect(posts).toEqual(res);
  });
});

describe("Mutation", () => {
  describe("add user", () => {
    it("creates a new user", async () => {
      const userArgs = { handle: "1" };
      const knex = knexMock([{ handle: "1", id: "1" }]);
      const res = await Mutation.addUser({}, userArgs, { knex });

      expect(knex().insert).toHaveBeenCalledWith(userArgs);
      expect(res).toEqual({ handle: "1", id: "1" });
    });

    it("fails when the handle is in use", () => {
      const userArgs = { handle: "1" };
      const err: any = new Error("Handle is in use");
      err.constraint = "users_handle_unique";
      const knex = knexMock(null, err);

      const resPromise = Mutation.addUser({}, userArgs, { knex });

      expect(resPromise).rejects.toThrow(
        'Handle "1" is already is use by another user'
      );
    });
  });

  describe("add post", () => {
    it("creates a post", async () => {
      const authorId = "37b24f1d-cec5-4b88-a64e-be362244faf4";

      const postArgs = {
        title: "Title",
        text: "Text",
        author: authorId,
      };
      const knex = knexMock([
        {
          id: "1",
          title: "Title",
          text: "Text",
          author_id: authorId,
        },
      ]);

      const res = await Mutation.addPost({}, postArgs, { knex });

      expect(knex().insert).toHaveBeenCalledWith({
        title: "Title",
        text: "Text",
        author_id: authorId,
      });
      expect(res).toEqual({
        id: "1",
        title: "Title",
        text: "Text",
        author_id: authorId,
      });
    });

    it("fails when the id is not a uuid", () => {
      const postArgs = { author: "1", title: "Title", text: "Text" };

      const resPromise = Mutation.addPost({}, postArgs, {
        knex: null as any,
      });
      expect(resPromise).rejects.toThrow("Author id must be a UUID");
    });

    it("fails when the author id cannot be found", () => {
      const postArgs = {
        author: "37b24f1d-cec5-4b88-a64e-be362244faf4",
        title: "Title",
        text: "Text",
      };
      const err: any = new Error("Database error");
      err.constraint = "posts_author_id_foreign";
      const knex = knexMock(null, err);

      const resPromise = Mutation.addPost({}, postArgs, { knex });

      expect(resPromise).rejects.toThrow(
        'User with id "37b24f1d-cec5-4b88-a64e-be362244faf4" was not found'
      );
    });
  });
});

describe("UserResolver", () => {
  it("loads the posts for the user", async () => {
    const parent = { id: "1", handle: "1" };
    const knex = knexMock([{ author_id: "1", title: "Title", text: "Text" }]);
    const res = await userResolver.posts(parent, {}, { knex });

    expect(res).toEqual([{ author_id: "1", title: "Title", text: "Text" }]);
  });
});

describe("Post", () => {
  it("loads the author for the post", async () => {
    const parent = { id: "1", author_id: "1", text: "text", title: "title" };
    const knex = knexMock({ id: "1", handle: "1" });
    const res = await postResolver.author(parent, {}, { knex });

    expect(res).toEqual({ id: "1", handle: "1" });
  });
});

/**
 * Test that all resolvers will error when the DB connection
 * errors
 */
describe("Database error", () => {
  test.each([
    { resolver: Query.posts, parent: null, args: {}, name: "Query.posts" },
    {
      resolver: Query.user,
      parent: null,
      args: { id: "1" },
      name: "Query.user",
    },
    { resolver: Query.users, parent: null, args: {}, name: "Query.users" },
    {
      resolver: Mutation.addPost,
      parent: null,
      args: {
        text: "Text",
        title: "Title",
        author: "37b24f1d-cec5-4b88-a64e-be362244faf4",
      },
      name: "Mutation.addPost",
    },
    {
      resolver: Mutation.addUser,
      parent: null,
      args: {
        handle: "1",
      },
      name: "Mutation.addUser",
    },
    {
      resolver: userResolver.posts,
      parent: { id: "1" },
      args: {},
      name: "userResolver.posts",
    },
    {
      resolver: postResolver.author,
      parent: { author_id: "1" },
      args: {},
      name: "postResolver.author",
    },
  ])("$name fails when DB call fails", ({ resolver, parent, args }) => {
    const err = new Error("Database error");
    const knex = knexMock(null, err);

    const resPromise = resolver(parent as any, args as any, { knex });

    expect(resPromise).rejects.toThrow("Database error");
  });
});
