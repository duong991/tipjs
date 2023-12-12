import { ApiKey } from '@/interfaces/apikey.interface';
import { model, Schema, Document } from 'mongoose';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
const InventorySchema: Schema = new Schema(
  {
    invent_product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    invent_location: {
      type: String,
      default: 'unknown',
    },
    invent_stock: {
      type: Number,
      required: true,
    },
    invent_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    invent_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const InventoryModel = model(DOCUMENT_NAME, InventorySchema);
