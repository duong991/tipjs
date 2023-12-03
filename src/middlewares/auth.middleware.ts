import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HEADER } from '@/constants';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { KeyTokenService } from '@/api/services/keyToken.service';
import { verifyToken } from '@/auth/authUtils';
import { NotFoundError, Unauthorized } from '@/helpers/valid_responses/error.response';
import { verify } from 'jsonwebtoken';
const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers[HEADER.CLIENT_ID] as string;

    if (!userId) {
      throw new HttpException(403, 'Forbidden');
    }

    const { publicKey } = await KeyTokenService.findPublicKeyByUserId(userId);
    if (!publicKey) {
      throw new NotFoundError({ message: 'Not found keystore' });
    }
    const accessToken = getAuthorization(req);
    if (!accessToken) {
      throw new Unauthorized({ message: 'Invalid Request' });
    }

    const decodeUser = verify(accessToken, publicKey) as RequestWithUser;
    console.log(decodeUser);
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
