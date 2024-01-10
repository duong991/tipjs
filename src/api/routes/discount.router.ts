import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { DiscountController } from '../controllers/discount.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import {
  CreateDiscountDto,
  GetProductsByDiscountCodeDto,
} from '@/dtos/discount.dto';
import { route } from '@/interfaces/router.interface';
import { createRoute } from '@/helpers/routeHelper';
import { _methods } from '@/constants';

export class DiscountRoute implements Routes {
  public path = '/discount';
  public router = Router();
  public discount = new DiscountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const routes: route[] = [
      /*
       * @route: GET /discount/amount
       * TODO: Get discount amount
       */
      {
        path: '/amount',
        method: _methods.GET,
        handler: this.discount.getDiscountAmount,
      },

      /*
       * @route: GET /discount/list_product_code
       * TODO: Get all products with discount
       */
      {
        path: '/list_product_code',
        method: _methods.GET,
        handler: this.discount.getAllProductsWithDiscountCode,
      },

      /*
       * @route: POST /discount
       * TODO: Create discount by shop
       */
      {
        path: '',
        method: _methods.POST,
        middlewares: [
          ValidationMiddleware(CreateDiscountDto, false, true, true),
          AuthMiddleware,
        ],
        handler: this.discount.createDiscount,
      },

      /*
       * @route: GET /discount
       * TODO: Get all discount codes
       */
      {
        path: '/shop/all',
        method: _methods.GET,
        middlewares: [
          ValidationMiddleware(GetProductsByDiscountCodeDto, false, true, true),
          AuthMiddleware,
        ],
        handler: this.discount.getAllDiscountCodesByShop,
      },

      /*
       * @route: DELETE /discount
       * TODO: Delete discount code
       */
      {
        path: '/',
        method: _methods.DELETE,
        middlewares: [AuthMiddleware],
        handler: this.discount.deleteDiscountCode,
      },
    ];

    routes.forEach(route => {
      createRoute(
        this.router,
        this.path,
        route.path,
        route.method,
        route.handler,
        route.middlewares,
      );
    });
  }
}
