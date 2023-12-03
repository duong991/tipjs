import { KeyTokenService } from '@/api/services/keyToken.service';
import { createTokenPair } from '@/auth/authUtils';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { DataStoredInAccessToken, DataStoredInRefreshToken } from '@/interfaces/auth.interface';
import crypto from 'crypto';

/*
 * @param payload
 * @param create: boolean whether to create a new key or update an existing one
 * @returns {Promise<{accessToken: string; refreshToken: string}>}
 */
const generateTokens = async (
  payloadAccess: DataStoredInAccessToken,
  payloadRefresh: DataStoredInRefreshToken,
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
      userId: payloadAccess.userId,
      publicKey,
    });
  } else {
    publicKeyString = await KeyTokenService.updateKeyToken({
      userId: payloadAccess.userId,
      publicKey,
    });
  }

  if (!publicKeyString) throw new HttpException(409, `Error create key token`);

  return await createTokenPair(payloadAccess, payloadRefresh, publicKeyString, privateKey);
};

export default generateTokens;
