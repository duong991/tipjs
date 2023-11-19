import handleException from '@/helpers/exceptions/tryCatch.helper';
import { sign, verify } from 'jsonwebtoken';

const createTokenPair = async (payload: any, publicKey: any, privateKey: any): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const accessToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30m',
    });

    const refreshToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    handleException(error);
  }
};

export { createTokenPair };
