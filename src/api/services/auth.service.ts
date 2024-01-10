import {
  DataStoredInAccessToken,
  DataStoredInRefreshToken,
  ILoginData,
  ISignUpData,
} from '@/interfaces/auth.interface';
import { hash, compare } from 'bcrypt';
import { Service } from 'typedi';
import { ShopModel } from '@/models/shop.model';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { RoleShop } from '@/constants';
import { Shop } from '@/interfaces/shop.interface';

/*UTILS*/
import generateTokens from '@/utils/generateTokens';
/*SERVICE*/
import { findByEmail } from './shop.service';
import getDataInfo from '@/utils/getInfoData';
import { KeyTokenService } from './keyToken.service';
import { verifyToken } from '@/auth/authUtils';
import { ForbiddenError } from '@/helpers/valid_responses/error.response';
import { verify } from 'jsonwebtoken';
import { Key } from '@/interfaces/key.interface';

@Service()
export class AuthService {
  public async signup(data: ISignUpData): Promise<{
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    shopInfo: Shop;
  }> {
    const { email, password, name } = data;
    const holderShop = await findByEmail({ email });
    if (holderShop) {
      throw new HttpException(409, `This email ${email} already exists`);
    }
    const passwordHash = await hash(password, 10);

    const newShop = await ShopModel.create({
      email,
      password: passwordHash,
      name,
      role: [RoleShop.SHOP],
    });
    if (newShop) {
      const payloadAccess: DataStoredInAccessToken = {
        userId: newShop._id,
        role: newShop.role,
      };

      const payloadRefresh: DataStoredInRefreshToken = {
        userId: newShop._id,
        email: newShop.email,
      };
      const tokens = await generateTokens(payloadAccess, payloadRefresh, true);
      await KeyTokenService.updateRefreshToken(
        newShop._id,
        tokens.refreshToken,
      );

      return {
        tokens,
        shopInfo: newShop,
      };
    }
  }

  public async login(data: ILoginData): Promise<{
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    shopInfo: Shop;
  }> {
    const { email, password, refreshToken } = data;

    const shop = await findByEmail({ email });
    const isCreateNewKey = (await KeyTokenService.findByUserId(shop._id))
      ? false
      : true;
    if (!shop) {
      throw new HttpException(409, `This email ${email} not exists`);
    }
    const isPasswordMatching = await compare(password, shop.password);
    if (!isPasswordMatching) {
      throw new HttpException(409, `This password ${password} not matching`);
    }

    const payloadAccess: DataStoredInAccessToken = {
      userId: shop._id,
      role: shop.role,
    };

    const payloadRefresh: DataStoredInRefreshToken = {
      userId: shop._id,
      email: shop.email,
    };

    const tokens = await generateTokens(
      payloadAccess,
      payloadRefresh,
      isCreateNewKey,
    );
    await KeyTokenService.updateRefreshToken(shop._id, tokens.refreshToken);

    return {
      tokens,
      shopInfo: getDataInfo({
        fields: ['_id', 'name', 'email', 'status', 'verified', 'role'],
        object: shop,
      }),
    };
  }

  public async logout(userId: string): Promise<any> {
    const delKey = await KeyTokenService.removeKeyById(userId);
    return delKey;
  }

  public async handleRefreshToken(
    keyToken: Key,
    user: any,
    refreshToken: string,
  ) {
    const { userId, email } = user;
    if (keyToken.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeKeyById(userId);
      throw new ForbiddenError({
        message: 'Some thing wrong happen. Please relogin',
      });
    }

    if (keyToken.refreshToken !== refreshToken) {
      throw new ForbiddenError({
        message: 'Some thing wrong happen. Please relogin',
      });
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop)
      throw new ForbiddenError({
        message: 'Some thing wrong happen. Please relogin',
      });

    // generate new token
    const payloadAccessToken: DataStoredInAccessToken = {
      userId: userId,
      role: foundShop.role,
    };
    const payloadRefreshToken: DataStoredInRefreshToken = {
      userId: userId,
      email: email,
    };
    const tokens = await generateTokens(
      payloadAccessToken,
      payloadRefreshToken,
      false,
    );

    // update refresh token
    await KeyTokenService.updateRefreshTokenAndRefreshTokenIsUsed(
      keyToken.user,
      tokens.refreshToken,
      refreshToken,
    );

    return tokens;
  }
}
