import { Router } from 'express';
import asyncHandler from '@/helpers/asyncHandler';

export function createRoute(
  router: Router,
  basePath: string,
  path: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  handler: any,
  middlewares?: any[],
) {
  const fullPath = `${basePath}${path}`;
  if (middlewares) {
    router[method](fullPath, ...middlewares, asyncHandler(handler));
  } else {
    router[method](fullPath, asyncHandler(handler));
  }
}
