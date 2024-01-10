import { Discount } from '@/interfaces/discount.interface';
import { model, Schema, Document } from 'mongoose';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';
const DiscountSchema: Schema = new Schema(
  {
    discount_name: { type: String, required: true, trim: true },
    discount_description: { type: String, required: true, trim: true },
    discount_code: { type: String, required: true, trim: true }, // ma discount
    discount_type: {
      type: String,
      required: true,
      trim: true,
      enum: ['fixed', 'percentage'],
    }, // loai discount
    discount_value: { type: Number, required: true }, // gia tri discount
    discount_start_date: { type: Date, required: true }, // ngay bat dau
    discount_end_date: { type: Date, required: true }, // ngay ket thuc
    discount_max_uses: { type: Number, required: true }, // so lan su dung cua discount
    discount_uses_count: { type: Number, required: true }, // số discount đã được sử dụng
    discount_users_used: { type: Array, required: true }, // danh sách user đã sử dụng discount
    discount_max_uses_per_user: { type: Number, required: true }, // số lần sử dụng tối đa của 1 user
    discount_min_order_amount: { type: Number, required: true }, // số tiền tối thiểu để sử dụng discount
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    discount_is_active: { type: Boolean, required: true }, // trạng thái discount
    discount_applies_to: {
      type: String,
      require: true,
      enum: ['all', 'specific'],
    }, // áp dụng cho
    discount_productIds: { type: Array, default: [] }, // danh sách product áp dụng
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const DiscountModel = model<Discount & Document>(
  DOCUMENT_NAME,
  DiscountSchema,
);
