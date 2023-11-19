import { ILoginData, ISignUpData } from '@/interfaces/auth.interface';
import { hash, compare } from 'bcrypt';
import Container, { Service } from 'typedi';
import { ShopModel } from '@/models/shop.model';
import { HttpException } from '@/helpers/exceptions/HttpException';
import handleException from '@/helpers/exceptions/tryCatch.helper';
import crypto from 'crypto';
import { KeyTokenService } from './keyToken.service';
import { RoleShop } from '@/constants';
import { createTokenPair } from '@/auth/authUtils';
import { Shop } from '@/interfaces/shop.interface';
@Service()
export class AuthService {
  public keyStore = Container.get(KeyTokenService);

  public async signup(data: ISignUpData): Promise<{
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    shopInfo: Shop;
  }> {
    try {
      const { email, password, name } = data;

      const holderShop = await ShopModel.find({
        email,
      }).lean();
      if (holderShop.length > 0) {
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        //TODO: create key token in schema "KeyStore"
        const publicKeyString = await this.keyStore.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) throw new HttpException(409, `Error create key token`);
        const payload = {
          userId: newShop._id,
          role: newShop.role,
        };
        const tokens = await createTokenPair(payload, publicKeyString, privateKey);
        return {
          tokens,
          shopInfo: newShop,
        };
      }
    } catch (error) {
      handleException(error);
    }
  }

  public async login(data: ILoginData): Promise<{
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    shopInfo: Shop;
  }> {
    try {
      const { email, password } = data;

      const shop = await ShopModel.findOne({
        email,
      }).lean();
      if (!shop) {
        throw new HttpException(409, `This email ${email} not exists`);
      }
      const isPasswordMatching = await compare(password, shop.password);
      if (!isPasswordMatching) {
        throw new HttpException(409, `This password ${password} not matching`);
      }
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      // update keyStore Schema
      const publicKeyString = await this.keyStore.updateKeyToken({
        userId: shop._id,
        publicKey,
      });

      if (!publicKeyString) throw new HttpException(409, `Error update key token`);

      const payload = {
        userId: shop._id,
        role: shop.role,
      };

      const tokens = await createTokenPair(payload, publicKeyString, privateKey);

      return {
        tokens,
        shopInfo: shop,
      };
    } catch (error) {
      handleException(error);
    }
  }
}
