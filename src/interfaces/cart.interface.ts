export type CartState = 'active' | 'completed' | 'failed' | 'pending';

export interface CartDocument {
  cart_state: CartState;
  cart_products: CartProduct[];
  cart_userId: number;
}

export interface CartProduct {
  productId?: string;
  shopId?: string;
  quantity?: number;
  price?: number;
}
