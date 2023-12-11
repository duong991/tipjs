import { ApiKey } from '@/interfaces/apikey.interface';
import { model, Schema, Document } from 'mongoose';
import { RoleShop } from '@/constants';

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';
const { WRITER, SHOP, ADMIN } = RoleShop;
const apiKeySchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      readonly: true,
      enum: [WRITER, SHOP, ADMIN],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const ApiKeyModel = model<ApiKey & Document>(DOCUMENT_NAME, apiKeySchema);
