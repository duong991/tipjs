import { ILoginData, ISignUpData } from '@/interfaces/auth.interface';
import { hash, compare } from 'bcrypt';
import Container, { Service } from 'typedi';
import { HttpException } from '@/helpers/exceptions/HttpException';
import handleException from '@/helpers/exceptions/tryCatch.helper';
import { ApiKeyModel } from '@/models/apikey.model';

export class ApiKeyService {
  static async findById(key: string): Promise<any> {
    const objKey = await ApiKeyModel.findOne({
      key,
      status: true,
    }).lean();

    return objKey;
  }
}
