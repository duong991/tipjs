import { ApiKeyService } from '@/api/services/apikey.service';
import { HEADER } from '@/constants';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { handleExceptionAndResponse } from '@/helpers/exceptions/tryCatch.helper';
import { RequestWithApiKey } from '@/interfaces/auth.interface';
import { NextFunction, Request, Response } from 'express';

export const apiKeyMiddleware = async (req: RequestWithApiKey, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      throw new HttpException(403, 'Forbidden');
    }

    const objKey = await ApiKeyService.findById(key);

    if (!objKey) {
      throw new HttpException(403, 'Forbidden');
    }
    req.apiKey = objKey;

    next();
  } catch (error) {
    handleExceptionAndResponse(error, req, res);
  }
};

export const permissionsMiddleware = permission => {
  return (req: RequestWithApiKey, res: Response, next: NextFunction) => {
    try {
      if (!req.apiKey.permissions) {
        throw new HttpException(403, 'Forbidden');
      }

      if (!req.apiKey.permissions.includes(permission)) {
        throw new HttpException(403, 'Forbidden');
      }
      return next();
    } catch (error) {
      handleExceptionAndResponse(error, req, res);
    }
  };
};
