import { Request, Response } from 'express';
import { ProductFactory } from '@/api/services/product.service';
import { IProduct } from '@/interfaces/product.interface';
import { Created } from '@/helpers/valid_responses/success.response';
export class ProductController {
  public createProduct = async (req: Request, res: Response) => {
    const productData: IProduct = req.body;
    const productType = productData.product_type;
    const result = await ProductFactory.createProduct(productType, productData);
    new Created({ message: 'Product created successfully', data: result }).send(res);
  };
}
