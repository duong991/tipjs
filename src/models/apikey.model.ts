import { ApiKey } from '@/interfaces/apikey.interface';
import { model, Schema, Document } from 'mongoose';

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

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
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const ApiKeyModel = model<ApiKey & Document>(DOCUMENT_NAME, apiKeySchema);
