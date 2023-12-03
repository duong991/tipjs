import { ReasonPhrases, StatusCodes } from '../httpStatusCode';

export default class ErrorResponse extends Error {
  public message: string;
  public status: number;
  public data: any;

  constructor({ message, status, data }: { message: string; status: number; data: any }) {
    super();
    this.message = message;
    this.status = status;
    this.data = data;
  }

  send(res: any) {
    return res.status(this.status).json({
      status: 'error',
      message: this.message,
      statusCode: this.status,
      data: this.data,
    });
  }
}

class BadRequest extends ErrorResponse {
  constructor({ message = ReasonPhrases.BAD_REQUEST, data = null }: { message?: string; data?: any }) {
    super({
      message,
      status: StatusCodes.BAD_REQUEST,
      data,
    });
  }
}

class Unauthorized extends ErrorResponse {
  constructor({ message = ReasonPhrases.UNAUTHORIZED, data = null }: { message?: string; data?: any }) {
    super({
      message,
      status: StatusCodes.UNAUTHORIZED,
      data,
    });
  }
}

class Forbidden extends ErrorResponse {
  constructor({ message = ReasonPhrases.FORBIDDEN, data = null }: { message?: string; data?: any }) {
    super({
      message,
      status: StatusCodes.FORBIDDEN,
      data,
    });
  }
}

class NotFoundError extends ErrorResponse {
  constructor({ message = ReasonPhrases.NOT_FOUND, data = null }: { message?: string; data?: any }) {
    super({
      message,
      status: StatusCodes.NOT_FOUND,
      data,
    });
  }
}

class InternalServerError extends ErrorResponse {
  constructor({ message = ReasonPhrases.INTERNAL_SERVER_ERROR, data = null }: { message?: string; data?: any }) {
    super({
      message,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      data,
    });
  }
}

export { BadRequest, Unauthorized, Forbidden, NotFoundError, InternalServerError };
