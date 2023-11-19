import { model, Schema, Document } from 'mongoose';
import { Shop } from '@interfaces/shop.interface';

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      maxLength: 150,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    role: {
      type: Schema.Types.Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const ShopModel = model<Shop & Document>(DOCUMENT_NAME, shopSchema);
