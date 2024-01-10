import { Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@/api/services/auth.service';
import {
  ILoginData,
  ISignUpData,
  RequestWithUser,
} from '@interfaces/auth.interface';
import { Created, OK } from '@/helpers/valid_responses/success.response';
import getDataInfo from '@/utils/getInfoData';
import { Key } from '@/interfaces/key.interface';
export class AuthController {
  public auth = Container.get(AuthService);
  public signUp = async (req: Request, res: Response) => {
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
  };

  public login = async (req: Request, res: Response) => {
    const loginData: ILoginData = req.body;

    const { shopInfo, tokens } = await this.auth.login(loginData);
    new OK({
      message: 'Shop successfully login',
      data: {
        shop: shopInfo,
        tokens: tokens,
      },
    }).send(res);
  };

  public logout = async (req: RequestWithUser, res: Response) => {
    new OK({
      message: 'Shop successfully logout',
      data: await this.auth.logout(req.userId),
    }).send(res);
  };

  public refreshToken = async (req, res: Response) => {
    const keyStore: Key = req.keyStore;
    const user = {
      userId: req.userId,
      email: req.email,
    };
    const refreshToken = req.refreshToken as string;
    const tokens = await this.auth.handleRefreshToken(
      keyStore,
      user,
      refreshToken,
    );
    new OK({
      message: 'Shop successfully refresh token',
      data: {
        tokens,
      },
    }).send(res);
  };
}
