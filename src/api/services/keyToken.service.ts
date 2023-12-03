import { KeyTokenModel } from '@/models/keytoken.model';
import { Types } from 'mongoose';
import { Service } from 'typedi';
@Service()
export class KeyTokenService {
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
    );

    return tokens ? tokens.publicKey : null;
  };

  public static findPublicKeyByUserId = async (userId: string): Promise<{ publicKey: string }> => {
    const keys = await KeyTokenModel.findOne({
      user: new Types.ObjectId(userId),
    }).lean();

    return {
      publicKey: keys ? keys.publicKey : null,
    };
  };

  public static removeKeyById = async (id: string): Promise<any> => {
    return await KeyTokenModel.deleteOne({
      user: new Types.ObjectId(id),
    });
  };
}
