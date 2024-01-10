import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ProductController } from '@/api/controllers/product.controller';
import { createRoute } from '@/helpers/routeHelper';
import { route } from '@/interfaces/router.interface';
import { _methods } from '@/constants';

export class ProductRoute implements Routes {
  public path = '/product';
  public router = Router();
  public product = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes the routes for the API.
   *
   * @param None
   * @return None
   */
  private initializeRoutes() {
    const routes: route[] = [
      /*
       * @route: GET /search
       * TODO: Search product by user
       */
      {
        path: '/search',
        method: _methods.GET,
        handler: this.product.searchProductByUser,
      },

      /*
       * @route: GET /
       * TODO: Get all products
       */
      { path: '', method: _methods.GET, handler: this.product.getAllProducts },

      /*
       * @route: GET /:product_id
       * TODO: Find product by ID
       */
      {
        path: '/:product_id',
        method: _methods.GET,
        handler: this.product.findProduct,
      },

      /*
       * @route: POST /
       * TODO: Create a new product
       */
      { path: '', method: _methods.POST, handler: this.product.createProduct },

      /*
       * @route: PUT /published/:product_id
       * TODO: Publish product by shop
       */
      {
        path: '/published/:product_id',
        method: _methods.PUT,
        middlewares: [AuthMiddleware],
        handler: this.product.publishProductByShop,
      },

      /*
       * @route: PUT /unPublished/:product_id
       * TODO: Unpublish product by shop
       */
      {
        path: '/unPublished/:product_id',
        method: _methods.PUT,
        middlewares: [AuthMiddleware],
        handler: this.product.unPublishProductByShop,
      },

      /*
       * @route: PATCH /:product_id
       * TODO: Update product
       */
      {
        path: '/:product_id',
        method: _methods.PATCH,
        middlewares: [AuthMiddleware],
        handler: this.product.updateProduct,
      },

      /*
       * @route: GET /drafts/all
       * TODO: Get all draft products for shop
       */
      {
        path: '/drafts/all',
        method: _methods.GET,
        middlewares: [AuthMiddleware],
        handler: this.product.getAllDraftProductsForShop,
      },

      /*
       * @route: GET /published/all
       * TODO: Get all published products for shop
       */
      {
        path: '/published/all',
        method: _methods.GET,
        middlewares: [AuthMiddleware],
        handler: this.product.getAllPublishProductsForShop,
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
