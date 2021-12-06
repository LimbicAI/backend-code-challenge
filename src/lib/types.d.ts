export type uuid = string;

export interface User {
  id: uuid;
  handle: string;
}

export type UserRow = User;

export interface Post {
  id: uuid;
  title: string;
  text: string;
  author: User;
}

export type PostRow = Omit<Post, "author"> & {
  author_id: uuid;
};
