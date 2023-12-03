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
