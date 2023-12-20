import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
// import { AuthMiddleware } from '@middlewares/auth.middleware';
import asyncHandler from '@/helpers/asyncHandler';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { DiscountController } from '../controllers/discount.controller';
export class DiscountRoute implements Routes {
  public path = '/discount';
  public router = Router();
  public discount = new DiscountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(AuthMiddleware);
    this.router.post(`${this.path}`, asyncHandler(this.discount.createDiscount));
    this.router.get(`${this.path}/all`, asyncHandler(this.discount.getAllProductsWithDiscountCode));
    this.router.get(`${this.path}/shop/all`, asyncHandler(this.discount.getAllDiscountCodesByShop));
    this.router.get(`${this.path}/amount`, asyncHandler(this.discount.getDiscountAmount));
    this.router.delete(`${this.path}/delete`, asyncHandler(this.discount.deleteDiscountCode));
    this.router.patch(`${this.path}/cancel`, asyncHandler(this.discount.cancelDiscountCode));
  }
}
