import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { route } from '@/interfaces/router.interface';
import { createRoute } from '@/helpers/routeHelper';
import { _methods } from '@/constants';
import { CartController } from '../controllers/cart.controller';
import { CreateNewCartDto } from '@/dtos/cart.dto';
export class CartRoute implements Routes {
  public path = '/cart';
  public router = Router();
  public cart = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const routes: route[] = [
      /*
       * @route: POST /cart
       * TODO: Create a new cart
       */
      {
        path: '/',
        method: _methods.POST,
        middlewares: [
          ValidationMiddleware(CreateNewCartDto, false, true, true),
        ],
        handler: this.cart.addToCart,
      },

      /*
       * @route: PUT /cart
       * TODO: Update
       */
      {
        path: '/',
        method: _methods.PUT,
        handler: this.cart.updateQuantity,
      },

      /*
       * @route: DELETE /cart
       * TODO: Delete product from cart
       */
      {
        path: '/:productId',
        method: _methods.DELETE,
        handler: this.cart.deleteProductFromCart,
      },

      /*
       * @route: GET /cart
       * TODO: Get user cart
       */
      {
        path: '/',
        method: _methods.GET,
        handler: this.cart.getUserCart,
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
