import { ApolloError } from "apollo-server-errors";

export class HandleAlreadyInUseError extends ApolloError {
  constructor(message: string) {
    super(message, "HANDLE_ALREADY_IN_USE");

    Object.defineProperty(this, "name", { value: "HandleAlreadyInUseError" });
  }
}

export class UserNotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, "USER_NOT_FOUND");

    Object.defineProperty(this, "name", { value: "UserNotFoundError" });
  }
}
