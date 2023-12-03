import { NextFunction, Request, Response } from 'express';
import handleException from './exceptions/tryCatch.helper';

const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await Promise.resolve(fn(req, res, next));
    } catch (error) {
      handleException(error, next);
    }
  };
};

export default asyncHandler;
