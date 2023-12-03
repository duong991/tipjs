import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { logger } from '@utils/logger';
import * as code from '@/helpers/httpStatusCode/statusCodes';
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    let statusResponse = code.OK;
    switch (status) {
      case 401:
        statusResponse = code.UNAUTHORIZED;
        break;
      case 403:
        statusResponse = code.FORBIDDEN;
        break;
      case 404:
        statusResponse = code.NOT_FOUND;
        break;
      case 500:
        statusResponse = code.INTERNAL_SERVER_ERROR;
        break;
    }
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    const errorMessage = status === 500 ? 'Internal Server Error' : message.includes(',') ? message.split(',')[0] : message;

    res.status(statusResponse).json({
      status: 'error',
      statusCode: status,
      message: errorMessage,
    });
  } catch (error) {
    next(error);
  }
};
