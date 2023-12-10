import { model, Schema, Document, Types } from 'mongoose';
import { IProduct } from '@/interfaces/product.interface';
import slugify from 'slugify';
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
    product_slug: String,
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
    product_ratingAvg: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must can not be more than 5'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

// Document middleware
ProductSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// Create index for search
ProductSchema.index({ product_name: 'text', product_description: 'text' });

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
