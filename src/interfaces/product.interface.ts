export interface IProduct {
  _id?: string;
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_slug?: string;
  product_price: number;
  product_type: string;
  product_shop: string;
  product_attributes: any;
  product_ratingAvg: number;
  isDraft?: boolean;
  isPublished?: boolean;
  product_quantity?: number;
}
