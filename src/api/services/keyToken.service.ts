import { KeyTokenModel } from '@/models/keytoken.model';
import { Types } from 'mongoose';
import { Service } from 'typedi';
import { Key } from '@/interfaces/key.interface';

@Service()
export class KeyTokenService {
  public static findByUserId = async (userId: string): Promise<Key> => {
    const keys = await KeyTokenModel.findOne({
      user: new Types.ObjectId(userId),
    }).lean();

    return keys;
  };

  public static createKeyToken = async ({ userId, publicKey }): Promise<any> => {
    const publicKeyString = publicKey.toString();
    const tokens = await KeyTokenModel.create({
      user: new Types.ObjectId(userId),
      publicKey: publicKeyString,
    });

    return tokens ? tokens.publicKey : null;
  };

  public static updateKeyToken = async ({ userId, publicKey }): Promise<any> => {
    const publicKeyString = publicKey.toString();
    const tokens = await KeyTokenModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        publicKey: publicKeyString,
      },
      {
        new: true,
      },
    ).lean();

    return tokens ? tokens.publicKey : null;
  };

  public static updateRefreshToken = async (userId: string, refreshToken: string): Promise<any> => {
    const tokens = await KeyTokenModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        refreshToken,
      },
      {
        new: true,
      },
    ).lean();
    return tokens;
  };

  public static updateRefreshTokenIsUsed = async (userId: string, refreshIsUsed: string): Promise<any> => {
    const tokens = await KeyTokenModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        $push: { refreshTokenUsed: refreshIsUsed },
      },
      {
        new: true,
      },
    ).lean();

    return tokens;
  };

  public static updateRefreshTokenAndRefreshTokenIsUsed = async (userId: string, refreshToken: string, refreshTokenIsUsed: string): Promise<any> => {
    const tokens = await KeyTokenModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        refreshToken,
        $push: { refreshTokenUsed: refreshTokenIsUsed },
      },
      {
        new: true,
      },
    ).lean();
    return tokens;
  };

  public static findKeyByUserId = async (userId: string): Promise<{ publicKey: string }> => {
    const keys = await KeyTokenModel.findOne({
      user: new Types.ObjectId(userId),
    }).lean();

    return keys;
  };

  public static removeKeyById = async (id: string): Promise<any> => {
    return await KeyTokenModel.deleteOne({
      user: new Types.ObjectId(id),
    }).lean();
  };

  public static findByRefreshTokenUsed = async (refreshToken: string): Promise<Key> => {
    const keys = await KeyTokenModel.findOne({
      // refreshToken in model is array of strings
      refreshTokenUsed: refreshToken,
    }).lean();

    return keys;
  };

  public static findRefreshToken = async (refreshToken: string): Promise<Key> => {
    const keys = await KeyTokenModel.findOne({
      refreshToken: refreshToken,
    }).lean();

    return keys;
  };
}
