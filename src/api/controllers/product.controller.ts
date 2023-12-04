import { Request, Response } from 'express';
// import { ProductFactory } from '@/api/services/product.service';
import { ProductFactory } from '../services/product.service.xxx';
import { IProduct } from '@/interfaces/product.interface';
import { Created } from '@/helpers/valid_responses/success.response';
import { RequestWithUser } from '@/interfaces/auth.interface';
export class ProductController {
  public createProduct = async (req, res: Response) => {
    const productData: IProduct = { ...req.body, product_shop: req.userId };
    const productType = productData.product_type;
    const result = await ProductFactory.createProduct(productType, productData);
    new Created({ message: 'Product created successfully', data: result }).send(res);
  };
}
