import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
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
    this.router.get(`${this.path}/search`, asyncHandler(this.product.searchProductByUser));
    this.router.get(`${this.path}`, asyncHandler(this.product.getAllProducts));
    this.router.get(`${this.path}/:product_id`, asyncHandler(this.product.findProduct));
    //=========================================================================
    this.router.use(AuthMiddleware);
    this.router.post(`${this.path}`, asyncHandler(this.product.createProduct));
    this.router.put(`${this.path}/published/:product_id`, asyncHandler(this.product.publishProductByShop));
    this.router.put(`${this.path}/unPublished/:product_id`, asyncHandler(this.product.unPublishProductByShop));
    this.router.patch(`${this.path}/:product_id`, asyncHandler(this.product.updateProduct));
    /*==================QUERY==================*/
    this.router.get(`${this.path}/drafts/all`, asyncHandler(this.product.getAllDraftProductsForShop));
    this.router.get(`${this.path}/published/all`, asyncHandler(this.product.getAllPublishProductsForShop));
  }
}
