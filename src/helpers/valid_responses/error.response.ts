import { IError } from '@/interfaces/response.interface';
import { HttpException } from '../exceptions/HttpException';
import { ReasonPhrases, StatusCodes } from '../httpStatusCode';

export default class ErrorResponse extends HttpException {
  public message: string;
  public status: number;

  constructor({ message, status }: { message: string; status: number }) {
    super(status, message);
    this.message = message;
    this.status = status;
  }
}

class BadRequest extends ErrorResponse {
  constructor({ message = ReasonPhrases.BAD_REQUEST }: IError) {
    super({
      message,
      status: StatusCodes.BAD_REQUEST,
    });
  }
}

class Unauthorized extends ErrorResponse {
  constructor({ message = ReasonPhrases.UNAUTHORIZED }: IError) {
    super({
      message,
      status: StatusCodes.UNAUTHORIZED,
    });
  }
}

class ForbiddenError extends ErrorResponse {
  constructor({ message = ReasonPhrases.FORBIDDEN }: IError) {
    super({
      message,
      status: StatusCodes.FORBIDDEN,
    });
  }
}

class NotFoundError extends ErrorResponse {
  constructor({ message = ReasonPhrases.NOT_FOUND }: IError) {
    super({
      message,
      status: StatusCodes.NOT_FOUND,
    });
  }
}

class InternalServerError extends ErrorResponse {
  constructor({ message = ReasonPhrases.INTERNAL_SERVER_ERROR }: IError) {
    super({
      message,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export {
  BadRequest,
  Unauthorized,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
