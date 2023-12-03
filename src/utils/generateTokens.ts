import { KeyTokenService } from '@/api/services/keyToken.service';
import { createTokenPair } from '@/auth/authUtils';
import { HttpException } from '@/helpers/exceptions/HttpException';
import crypto from 'crypto';

const generateTokens = async (
  payload: any,
  create: boolean,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
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
  let publicKeyString = '';
  if (create) {
    publicKeyString = await KeyTokenService.createKeyToken({
      userId: payload.userId,
      publicKey,
    });
  } else {
    publicKeyString = await KeyTokenService.updateKeyToken({
      userId: payload.userId,
      publicKey,
    });
  }

  if (!publicKeyString) throw new HttpException(409, `Error create key token`);

  return await createTokenPair(payload, publicKeyString, privateKey);
};

export default generateTokens;
