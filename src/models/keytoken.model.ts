import { model, Schema, Document } from 'mongoose';
import { Key } from '@/interfaces/key.interface';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    publicKey: { type: String, required: true },
    refreshToken: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const KeyTokenModel = model<Key & Document>(DOCUMENT_NAME, keyTokenSchema);
