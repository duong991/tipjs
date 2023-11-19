import handleException from '@/helpers/exceptions/tryCatch.helper';
import { KeyTokenModel } from '@/models/keytoken.model';
import { Types } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class KeyTokenService {
  public createKeyToken = async ({ userId, publicKey }): Promise<any> => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await KeyTokenModel.create({
        user: new Types.ObjectId(userId),
        publicKey: publicKeyString,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      handleException(error);
    }
  };

  public updateKeyToken = async ({ userId, publicKey }): Promise<any> => {
    try {
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
    } catch (error) {
      handleException(error);
    }
  };
}
