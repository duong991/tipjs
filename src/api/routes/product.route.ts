import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
// import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import asyncHandler from '@/helpers/asyncHandler';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ProductController } from '@/api/controllers/product.controller';
export class ProductRoute implements Routes {
  public path = '/product';
  public router = Router();
  public product = new ProductController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(AuthMiddleware);
    this.router.post(`${this.path}`, asyncHandler(this.product.createProduct));
  }
}
