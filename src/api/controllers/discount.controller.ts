import { Request, Response } from 'express';
import { Created, OK } from '@/helpers/valid_responses/success.response';
import DiscountService from '../services/discount.service';
import { Discount } from '@/interfaces/discount.interface';

export class DiscountController {
  /**
   * @description Create discount code
   * */
  public createDiscount = async (req, res: Response) => {
    const discountData = { ...req.body, shopId: req.userId };
    new Created({
      message: 'Discount successfully created',
      data: await DiscountService.createDiscountCode(discountData),
    }).send(res);
  };

  /**
   * @description Update discount code
   * */
  public getAllProductsWithDiscountCode = async (req, res: Response) => {
    const { code, shopId } = req.body;
    const { limit, page } = req.query;
    const { userId } = req.userId;
    new OK({
      message: 'Get all products with discount code successfully',
      data: await DiscountService.getAllProductsWithDiscountCode({ code, shopId, userId, limit, page }),
    }).send(res);
  };

  /**
   * @description Get discount code by shop
   * */
  public getAllDiscountCodesByShop = async (req: Request, res: Response) => {
    const { shopId } = req.body;
    const { limit, page, sort } = req.query;
    new OK({
      message: 'Get all discount codes by shop successfully',
      data: await DiscountService.getAllDiscountCodesByShop({ shopId, limit, page, sort }),
    }).send(res);
  };

  /**
   * @description Get discount code by shop
   * */
  public getDiscountAmount = async (req, res: Response) => {
    const { code, shopId, products } = req.body;
    const { userId } = req.userId;
    new OK({
      message: 'Get discount amount successfully',
      data: await DiscountService.getDiscountAmount({ code, userId, shopId, products }),
    }).send(res);
  };

  /**
   * @description Delete discount code
   * */
  public deleteDiscountCode = async (req, res: Response) => {
    const shopId = req.userId;
    const { code } = req.query;

    const result = await DiscountService.deleteDiscountCode({ shopId, code });
    new OK({ message: 'Delete discount code successfully', data: result }).send(res);
  };

  public cancelDiscountCode = async (req, res: Response) => {};
}
