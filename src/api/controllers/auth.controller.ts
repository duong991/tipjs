import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@/api/services/auth.service';
import { ILoginData, ISignUpData } from '@interfaces/auth.interface';
import { Created, OK } from '@/helpers/valid_responses/success.response';
import getDataInfo from '@/utils/getInfoData';
export class AuthController {
  public auth = Container.get(AuthService);
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopData: ISignUpData = req.body;
      const result = await this.auth.signup(shopData);
      new Created({
        message: 'Shop successfully created',
        data: {
          shop: getDataInfo({
            fields: ['_id', 'name', 'email', 'status', 'verified', 'role'],
            object: result.shopInfo,
          }),
          tokens: result.tokens,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: ILoginData = req.body;

      const result = await this.auth.login(loginData);

      new OK({
        message: 'Shop successfully login',
        data: {
          shop: getDataInfo({
            fields: ['_id', 'name', 'email', 'status', 'verified', 'role'],
            object: result.shopInfo,
          }),
          tokens: result.tokens,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
