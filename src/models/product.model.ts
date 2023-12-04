import { model, Schema, Document, Types } from 'mongoose';
import { Key } from '@/interfaces/key.interface';
import { IProduct } from '@/interfaces/product.interface';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const ProductSchema: Schema = new Schema(
  {
    product_name: {
      type: String,
      require: true,
    },
    product_thumb: {
      type: String,
      require: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      require: true,
    },
    product_type: {
      type: String,
      require: true,
      enum: ['Electronics', 'Clothes', 'Furniture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

const ClothingSchema: Schema = new Schema(
  {
    product_shop: { type: Types.ObjectId, required: true, ref: 'Shop' },
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String, required: true },
  },
  {
    collection: 'Clothes',
    timestamps: true,
  },
);

const ElectronicSchema: Schema = new Schema(
  {
    product_shop: { type: Types.ObjectId, required: true, ref: 'Shop' },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    collection: 'Electronics',
    timestamps: true,
  },
);

const FurnitureSchema: Schema = new Schema(
  {
    product_shop: { type: Types.ObjectId, required: true, ref: 'Shop' },
    brand: { type: String, required: true },
    material: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    collection: 'Furnitures',
    timestamps: true,
  },
);

export const ProductModel = model<IProduct & Document>(DOCUMENT_NAME, ProductSchema);
export const ClothingModel = model('Clothing', ClothingSchema);
export const ElectronicModel = model('Electronic', ElectronicSchema);
export const FurnitureModel = model('Furniture', FurnitureSchema);
