import { NextFunction, Request, Response } from 'express';
import { DataStoredInAccessToken, DataStoredInRefreshToken, RequestWithRefreshToken, RequestWithUser } from '@/interfaces/auth.interface';
import { HEADER } from '@/constants';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { KeyTokenService } from '@/api/services/keyToken.service';
import { verifyToken } from '@/auth/authUtils';
import { NotFoundError, Unauthorized } from '@/helpers/valid_responses/error.response';
const getAuthorization = req => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers[HEADER.CLIENT_ID] as string;

    if (!userId) {
      throw new HttpException(403, 'Forbidden');
    }

    const key = await KeyTokenService.findKeyByUserId(userId);
    if (!key) {
      throw new NotFoundError({ message: 'Not found keystore' });
    }

    ///========================= handle refresh token =========================
    if (req.headers[HEADER.REFRESH_TOKEN]) {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN] as string;
      const decodeRefreshToken = (await verifyToken(refreshToken, key.publicKey)) as DataStoredInRefreshToken;
      if (userId !== decodeRefreshToken.userId) {
        throw new Unauthorized({ message: 'Invalid User' });
      }
      req.userId = userId.toString();
      req.email = decodeRefreshToken.email;
      req.keyStore = key;
      req.refreshToken = refreshToken;
      next();
      return;
    }

    ///========================= handle access token =========================
    const accessToken = getAuthorization(req);
    if (!accessToken) {
      throw new Unauthorized({ message: 'Invalid Request' });
    }

    const decodeUser = (await verifyToken(accessToken, key.publicKey)) as DataStoredInAccessToken;
    if (userId !== decodeUser.userId) {
      throw new Unauthorized({ message: 'Invalid User' });
    }
    req.userId = userId.toString();
    req.role = decodeUser.role;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
