import { DataStoredInToken, ILoginData, ISignUpData } from '@/interfaces/auth.interface';
import { hash, compare } from 'bcrypt';
import { Service } from 'typedi';
import { ShopModel } from '@/models/shop.model';
import { HttpException } from '@/helpers/exceptions/HttpException';
import handleException from '@/helpers/exceptions/tryCatch.helper';
import { RoleShop } from '@/constants';
import { Shop } from '@/interfaces/shop.interface';

/*UTILS*/
import generateTokens from '@/utils/generateTokens';
/*SERVICE*/
import { findByEmail } from './shop.service';
import getDataInfo from '@/utils/getInfoData';
import { KeyTokenModel } from '@/models/keytoken.model';
import { KeyTokenService } from './keyToken.service';

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
      const payload: DataStoredInToken = {
        userId: newShop._id,
        role: newShop.role,
      };

      const tokens = await generateTokens(payload, true);

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
    if (!shop) {
      throw new HttpException(409, `This email ${email} not exists`);
    }
    const isPasswordMatching = await compare(password, shop.password);
    if (!isPasswordMatching) {
      throw new HttpException(409, `This password ${password} not matching`);
    }

    const payload: DataStoredInToken = {
      userId: shop._id,
      role: shop.role,
    };

    const tokens = await generateTokens(payload, false);

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
}
