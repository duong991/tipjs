import { Router } from 'express';
import { AuthController } from '@/api/controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
// import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { route } from '@/interfaces/router.interface';
import { createRoute } from '@/helpers/routeHelper';
import { _methods } from '@/constants';
export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const routes: route[] = [
      /*
       * @route: POST /auth/signup
       * TODO: Sign up
       */
      {
        path: '/signup',
        method: _methods.POST,
        handler: this.auth.signUp,
      },

      /*
       * @route: POST /auth/login
       * TODO: Login
       */
      {
        path: '/login',
        method: _methods.POST,
        handler: this.auth.login,
      },

      /*
       * @route: POST /auth/logout
       * TODO: Logout
       */
      {
        path: '/logout',
        method: _methods.POST,
        middlewares: [AuthMiddleware],
        handler: this.auth.logout,
      },

      /*
       * @route: POST /auth/refresh-token
       * TODO: Refresh token
       */
      {
        path: '/refresh-token',
        method: _methods.POST,
        middlewares: [AuthMiddleware],
        handler: this.auth.refreshToken,
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
