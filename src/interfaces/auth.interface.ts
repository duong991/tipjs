import { Request } from 'express';

export interface DataStoredInToken {
  userId: string;
  role: string[];
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  userId: string;
  role: string[];
}

export interface RequestWithApiKey extends Request {
  apiKey: any;
}

export interface ISignUpData {
  email: string;
  name: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
  refreshToken?: string;
}
