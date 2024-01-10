import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/helpers/exceptions/HttpException';

/**
 * @name ValidationMiddleware
 * @description Middleware thực hiện validate lại object trước khi vào controller
 * @param type dto
 *
 * @param skipMissingProperties true => Không báo lỗi khi thiếu thuộc tính
 *                            ||false => Báo lỗi khi thiếu thuộc tính
 *
 * @param whitelist true => bỏ qua thuộc tính không được định nghĩa
 *                ||false => giữ lại các thuộc tính không định nghĩa
 *
 * @param forbidNonWhitelisted true => Báo lỗi khi có thuộc tính không định nghĩa
 *                           ||false => Không báo lỗi khi có thuộc tính không định nghĩa
 */
export const ValidationMiddleware = (
  type: any,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    validateOrReject(dto, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(', ');
        next(new HttpException(400, message));
      });
  };
};
