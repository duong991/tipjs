import { log } from 'console';
import { HttpException } from './HttpException';
import { NextFunction, Request, Response } from 'express';
import { logger } from '@/utils/logger';
import { RequestWithApiKey } from '@/interfaces/auth.interface';

const handleException = (error: any, next: NextFunction) => {
  try {
    log(error);
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(500, error.message);
    }
  } catch (error) {
    next(error);
  }
};

export const handleExceptionAndResponse = (error: any, req: Request | RequestWithApiKey, res: Response) => {
  try {
    log(error);
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(500, error.message);
    }
  } catch (error) {
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
  }
};

export default handleException;
