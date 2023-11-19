import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { logger } from '@utils/logger';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    // eslint-disable-next-line prettier/prettier
    let statusResponse = 200;
    switch (status) {
      case 401:
        statusResponse = 401;
        break;
      case 403:
        statusResponse = 403;
        break;
      case 500:
        statusResponse = 500;
        break;
      default:
        statusResponse = 200;
        break;
    }
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(statusResponse).json({
      status: 'error',
      statusCode: status,
      message: message.includes(',') ? message.split(',')[0] : message,
    });
  } catch (error) {
    next(error);
  }
};
