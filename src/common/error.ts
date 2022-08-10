export  class CustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class TooManyRequestError extends CustomError {
    constructor(message: string) {
        super(message, 429);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class ConflictError extends CustomError {
    constructor(message: string) {
        super(message, 409);
    }
}



