export interface Discount {
  _id?: string;
  discount_name: string;
  discount_description: string;
  discount_code: string; // ma discount
  discount_type: string; // loai discount
  discount_value: number; // gia tri discount
  discount_start_date: Date; // ngay bat dau
  discount_end_date: Date; // ngay ket thuc
  discount_max_uses: number; // so lan su dung cua discount
  discount_uses_count: number; // số discount đã được sử dụng
  discount_users_used?: IDiscountUserUsed[]; // danh sách user đã sử dụng discount
  discount_max_uses_per_user: number; // số lần sử dụng tối đa của 1 user
  discount_min_order_amount: number; // số tiền tối thiểu để sử dụng discount
  discount_shopId: string;
  discount_is_active: boolean; // trạng thái discount
  discount_applies_to: string;
  discount_productIds?: string[]; // danh sách product áp dụng
}

export interface IDiscountUserUsed {
  userId: string;
  uses: number;
}
