import { Router } from 'express';
import { AuthController } from '@/api/controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
// import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import asyncHandler from '@/helpers/asyncHandler';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, asyncHandler(this.auth.signUp));
    this.router.post(`${this.path}/login`, asyncHandler(this.auth.login));
    this.router.post(`${this.path}/logout`, AuthMiddleware, asyncHandler(this.auth.logout));
  }
}
