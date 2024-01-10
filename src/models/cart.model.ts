import { CartDocument } from '@/interfaces/cart.interface';
import { model, Schema, Document } from 'mongoose';

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartProductSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema: Schema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      default: 'active',
      enum: ['active', 'completed', 'failed', 'pending'],
    },
    cart_products: {
      type: [cartProductSchema],
      required: true,
      default: [{}],
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const CartModel = model<CartDocument & Document>(
  DOCUMENT_NAME,
  cartSchema,
);
