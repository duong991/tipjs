import { ProductModel, ClothingModel, ElectronicModel, FurnitureModel } from '@/models/product.model';
import { IProduct } from '@/interfaces/product.interface';
import { HttpException } from '@/helpers/exceptions/HttpException';
// define Factory class to create product
class ProductFactory {
  static productRegistry = {};

  static registerProduct(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  /**
   * @param {string} type
   * @param {IProduct} payload
   */
  static async createProduct(type, payload: IProduct): Promise<IProduct> {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new HttpException(400, 'Type not supported');
    return await new productClass(payload).createProduct();
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
  async createProduct(product_id) {
    return await ProductModel.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new HttpException(400, 'Create clothing failed');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new HttpException(400, 'Create product failed');
    return newProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new HttpException(400, 'Create electronic failed');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new HttpException(400, 'Create product failed');
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new HttpException(400, 'Create furniture failed');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new HttpException(400, 'Create product failed');
    return newProduct;
  }
}

// register product type
ProductFactory.registerProduct('Clothes', Clothing);
ProductFactory.registerProduct('Electronics', Electronic);
ProductFactory.registerProduct('Furniture', Furniture);

export { ProductFactory };
