import { ProductModel, ClothingModel, ElectronicModel } from '@/models/product.model';
import { IProduct } from '@/interfaces/product.interface';
import { HttpException } from '@/helpers/exceptions/HttpException';
// define Factory class to create product
class ProductFactory {
  /**
   * @param {string} type
   * @param {IProduct} payload
   */
  static async createProduct(type, payload: IProduct): Promise<IProduct> {
    switch (type) {
      case 'Clothes':
        return await new Clothing(payload).createProduct();
      case 'Electronics':
        return await new Electronic(payload).createProduct();
      default:
        throw new HttpException(400, 'Type not supported');
    }
  }
}

class Product {
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_type: string;
  product_shop: string;
  product_attributes: any;

  constructor({ product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes }: IProduct) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create a new product
  async createProduct() {
    return await ProductModel.create(this);
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create(this.product_attributes);
    if (!newClothing) throw new HttpException(400, 'Create clothing failed');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new HttpException(400, 'Create product failed');
    return newProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create(this.product_attributes);
    if (!newElectronic) throw new HttpException(400, 'Create electronic failed');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new HttpException(400, 'Create product failed');
    return newProduct;
  }
}

export { ProductFactory };
