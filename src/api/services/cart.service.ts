import { HttpException } from '@/helpers/exceptions/HttpException';
import { CartProduct } from '@/interfaces/cart.interface';
import {
  addNewProductToCart,
  createUserCard,
  deleteUserCard,
  findUserCart,
  updateProductQuantity,
} from '@/models/repositories/cart.repo';
import {
  findProduct,
  findProductById,
} from '@/models/repositories/product.repo';
import { convertToObjetId } from '@/utils';

export class CartService {
  /**
   * @desc: Add product to cart v1
   * */
  static async addToCart({ userId, product }) {
    /* Get data product update */
    const foundProduct = await findProduct({
      query: {
        _id: convertToObjetId(product.productId),
        product_shop: convertToObjetId(product.shopId),
      },
      select: ['product_name', 'product_shop', 'product_price'],
    });

    if (!foundProduct) throw new HttpException(404, 'Product not found');
    const productUpdate: CartProduct = {
      productId: foundProduct._id,
      quantity: product.quantity,
      price: foundProduct.product_price,
      shopId: foundProduct.product_shop,
    };

    /* Check user cart */
    const userCart = await findUserCart({ userId });

    if (!userCart || userCart.cart_products.length === 0) {
      /* Create new cart or update empty cart */
      return await createUserCard({ userId, product: productUpdate });
    }

    const productExistsInCart = userCart.cart_products
      .map(item => item.productId.toString())
      .includes(product.productId);

    if (!productExistsInCart) {
      /* Add new product to cart */
      return await addNewProductToCart({
        userId,
        product: productUpdate,
      });
    }

    /* Update product quantity */
    return await updateProductQuantity({
      userId,
      product: productUpdate,
    });
  }

  /**
   * @desc: Add product to cart v2
   *
      shop_order_ids : [
        {
            shopId,
            item_products : [
                {
                  quantity,
                  price,
                  shopId,
                  old_quantity,
                  productId
                }
            ],
            version :
        }
      ]
   * */

  static async updateProductQuantity({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    /* TODO: Check product exist */
    const foundProduct = await findProductById({ product_id: productId });

    if (!foundProduct) throw new HttpException(404, 'Product not found');
    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new HttpException(401, 'Invalid product');
    }

    if (quantity === 0) {
      /* TODO: Delete product from cart */
      deleteUserCard({ userId, productId });
    }

    return await updateProductQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
        price: foundProduct.product_price,
        shopId: shop_order_ids[0].shopId,
      },
    });
  }

  // static async updateProductQuantity({ userId, shop_order_ids }) {
  //   const { quantity, shopId, old_quantity, productId } =
  //     shop_order_ids[0]?.item_products;

  //   /* TODO: Check product exist */
  //   const foundProduct = await findProductById({ product_id: productId });

  //   if (!foundProduct) throw new HttpException(404, 'Product not found');
  //   if (foundProduct._id !== productId)
  //     throw new HttpException(401, 'Invalid product');

  //   if (quantity === 0) {
  //     /* TODO: Delete product from cart */
  //     deleteUserCard({ userId, productId });
  //   }

  //   return await updateProductQuantity({
  //     userId,
  //     product: {
  //       productId,
  //       quantity: quantity - old_quantity,
  //       price: foundProduct.product_price,
  //       shopId,
  //     },
  //   });
  // }

  static async deleteUserCard({ userId, productId }) {
    return await deleteUserCard({ userId, productId });
  }

  static async getUserCart({ userId }) {
    return await findUserCart({ userId, unSelect: ['_id', '__v'] });
  }
}
