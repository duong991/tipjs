import { Response } from 'express';
import { Created, OK } from '@/helpers/valid_responses/success.response';
import { CartService } from '../services/cart.service';

export class CartController {
  /**
   * @description Create a new Cart
   * */
  public addToCart = async (req, res: Response) => {
    const { userId, product } = req.body;

    const result = await CartService.addToCart({ userId, product });
    new Created({ message: 'Product added to cart', data: result }).send(res);
  };

  /**
   * @description Update product quantity (Increase quantity or decrease quantity)
   * */
  public updateQuantity = async (req, res: Response) => {
    const { userId, shop_order_ids } = req.body;

    const tong = CartService.tinhtong();
    const result = await CartService.updateProductQuantity({
      userId,
      shop_order_ids,
    });
    new OK({ message: 'Product quantity updated', data: result }).send(res);
  };

  /**
   * @description Delete product from cart
   * */
  public deleteProductFromCart = async (req, res: Response) => {
    const { productId } = req.params;
    const { userId } = req.body;
    const result = await CartService.deleteUserCard({ userId, productId });
    new OK({ message: 'Product deleted from cart', data: result }).send(res);
  };

  /**
   * @description Get user cart
   * */
  public getUserCart = async (req, res: Response) => {
    const { userId } = req.body;
    const result = await CartService.getUserCart({ userId });
    new OK({ message: 'User cart', data: result }).send(res);
  };
}
