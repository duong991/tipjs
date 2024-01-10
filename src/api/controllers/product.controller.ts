import { Request, Response } from 'express';
// import { ProductFactory } from '@/api/services/product.service';
import { ProductFactory } from '../services/product.service';
import { IProduct } from '@/interfaces/product.interface';
import { Created, OK } from '@/helpers/valid_responses/success.response';
export class ProductController {
  /**
   * @desc Creates a new Product
   * */
  public createProduct = async (req, res: Response) => {
    const productData: IProduct = { ...req.body, product_shop: req.userId };
    const productType = productData.product_type;
    const result = await ProductFactory.createProduct(productType, productData);
    new Created({ message: 'Product created successfully', data: result }).send(
      res,
    );
  };

  /**
   * @desc Get all draft products for shop
   * @param {Number} limit
   * @param {Number} skip
   * */
  public getAllDraftProductsForShop = async (req, res: Response) => {
    const shopId = req.userId;
    const { limit, skip } = req.query;
    const result = await ProductFactory.findAllDraftProductsForShop({
      products_shop: shopId,
      limit,
      skip,
    });
    new OK({ message: 'Get all draft product', data: result }).send(res);
  };

  /**
   * @desc Get all publish products for shop
   * @param {Number} limit
   * @param {Number} skip
   * */
  public getAllPublishProductsForShop = async (req, res: Response) => {
    const shopId = req.userId;
    const { limit, skip } = req.query;
    const result = await ProductFactory.findAllPublishProductsForShop({
      products_shop: shopId,
      limit,
      skip,
    });
    new OK({ message: 'Get all publish product', data: result }).send(res);
  };

  /**
   * @desc Publish product by shop
   * @param {String} product_id
   * */
  public publishProductByShop = async (req, res: Response) => {
    const shopId = req.userId;
    const { product_id } = req.params;
    const result = await ProductFactory.publicProductByShop({
      product_shop: shopId,
      product_id,
    });
    new OK({ message: 'Get public product', data: result }).send(res);
  };

  /**
   * @desc  unPublish product by shop
   * @param {String} product_id
   * */
  public unPublishProductByShop = async (req, res: Response) => {
    const shopId = req.userId;
    const { product_id } = req.params;
    new OK({
      message: 'Get un publish product',
      data: await ProductFactory.unPublishedProductByShop({
        product_shop: shopId,
        product_id,
      }),
    }).send(res);
  };

  /**
   * @desc  Search product for user
   * @param {String} keySearch
   * @param {Number} limit
   * @param {Number} skip
   * */
  public searchProductByUser = async (req, res: Response) => {
    const { q } = req.query;
    new OK({
      message: 'Get search product',
      data: await ProductFactory.searchProductByUser({ keySearch: q }),
    }).send(res);
  };

  /**
   * @desc  Get all products
   * @param {Number} limit
   * @param {Number} sort
   * @param {Number} page
   * */
  public getAllProducts = async (req, res: Response) => {
    const { limit, sort, page } = req.query;
    new OK({
      message: 'Get all product',
      data: await ProductFactory.findAllProducts({ limit, sort, page }),
    }).send(res);
  };

  /**
   * @desc  Get product
   * @param {String} product_id
   * */
  public findProduct = async (req, res: Response) => {
    const { product_id } = req.params;
    new OK({
      message: 'Get product',
      data: await ProductFactory.findProduct({ product_id }),
    }).send(res);
  };

  /**
   * @desc  Update product
   * @param {String} product_id
   * */
  public updateProduct = async (req, res: Response) => {
    const { product_id } = req.params;
    const productData: IProduct = { ...req.body, product_shop: req.userId };
    const productType = productData.product_type;
    const result = await ProductFactory.updateProduct(
      productType,
      product_id,
      productData,
    );
    new OK({
      message: 'Update product',
      data: result,
    }).send(res);
  };
}
