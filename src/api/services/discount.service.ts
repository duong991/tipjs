import { timezone7 } from '@utils/dateUtils';
import { HttpException } from '@/helpers/exceptions/HttpException';
import { DiscountModel } from '@/models/discount.model';
import { convertToObjetId, removeUndefinedObject } from '@/utils';
import { checkDiscountExists, findAllProducts } from '@/models/repositories/product.repo';
import { findAllDiscountCodeUnSelect } from '@/models/repositories/discount.repo';
import { Discount } from '@/interfaces/discount.interface';
import { IProduct } from '@/interfaces/product.interface';
/**
 *  Discount service
 * 1- Generate Discount code [Shop | Admin]
 * 2- Get discount amount [User]
 * 3- Get all discount code [User]
 * 4- Verify discount code [User]
 * 5- Delete discount code [Shop | Admin]
 * 6- Update discount code [Shop | Admin]
 */

class DiscountService {
  static async createDiscountCode(payload): Promise<Discount> {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    if (timezone7() < new Date(start_date || timezone7() < new Date(end_date) || new Date(start_date) > new Date(end_date))) {
      throw new HttpException(400, 'Invalid date');
    }

    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: { discount_code: code, discount_shopId: convertToObjetId(shopId) },
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new HttpException(400, 'Discount code already exists');
    }

    const discount = DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_code: code,
      discount_type: type,
      discount_value: value,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_amount: min_order_value,
      discount_shopId: convertToObjetId(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_productIds: applies_to === 'all' ? [] : product_ids,
    });

    return discount;
  }

  static async updateDiscountCode(payload) {
    const objectParams = removeUndefinedObject({ ...payload });
  }

  /**
   *  @description Get all product have discount code [User]
   * */
  static async getAllProductsWithDiscountCode({ code, shopId, userId, limit, page }): Promise<IProduct[]> {
    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: { discount_code: code, discount_shopId: convertToObjetId(shopId) },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new HttpException(404, 'Discount code not found');
    }

    const { discount_applies_to, discount_productIds } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      // find all products
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjetId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name', 'product_price', 'product_thumb'],
      });
    }
    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjetId(shopId),
          isPublished: true,
          _id: { $in: discount_productIds },
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name', 'product_price', 'product_thumb'],
      });
    }

    return products;
  }

  /**
   * @description Get discount code by shop
   * */
  static async getAllDiscountCodesByShop(payload): Promise<Discount[]> {
    const { shopId, limit, page, sort } = payload;

    const discount = await findAllDiscountCodeUnSelect({
      limit,
      page,
      sort,
      unSelect: ['__v', 'discount_shopId'],
      filter: {
        discount_shopId: convertToObjetId(shopId),
        discount_is_active: true,
      },
    });

    return discount;
  }

  /**
   * @description Apply discount code
   * */
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: DiscountModel,
      filter: { discount_code: code, discount_shopId: convertToObjetId(shopId) },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new HttpException(404, 'Discount code not found');
    }

    const {
      discount_applies_to,
      discount_productIds,
      discount_min_order_amount,
      discount_type,
      discount_value,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
    } = foundDiscount;

    let totalDiscount = 0;
    let totalAmount = 0;
    let discountPercent = 0;
    let discountAmount = 0;
    let discountMaxValue = 0;

    if (
      timezone7() <
      new Date(discount_start_date || timezone7() < new Date(discount_end_date) || new Date(discount_start_date) > new Date(discount_end_date))
    ) {
      throw new HttpException(400, 'Invalid date');
    }

    if (discount_applies_to === 'all') {
      totalAmount = products.reduce((total, product) => {
        return total + product.product_price * product.product_quantity;
      }, 0);
    }

    if (discount_applies_to === 'specific') {
      totalAmount = products.reduce((total, product) => {
        const foundProduct = discount_productIds.find(id => id === product.product_id);
        if (foundProduct) {
          return total + product.product_price * product.product_quantity;
        }
        return total;
      }, 0);
    }

    if (discount_min_order_amount > totalAmount) {
      throw new HttpException(400, 'Minimum order amount not reached');
    }

    if (discount_max_uses_per_user > 0) {
      const foundUser = foundDiscount.discount_users_used.find(user => user.userId === userId);
      if (foundUser) {
        if (foundUser.uses >= discount_max_uses_per_user) {
          throw new HttpException(400, 'Discount code has been used');
        }
      }
    }
    if (discount_type === 'percent') {
      discountPercent = discount_value;
      discountAmount = (discountPercent / 100) * totalAmount;
      discountMaxValue = discountMaxValue > discountAmount ? discountMaxValue : discountAmount;
    }

    if (discount_type === 'fixed') {
      discountAmount = discount_value;
      discountMaxValue = discountMaxValue > discountAmount ? discountMaxValue : discountAmount;
    }
    totalDiscount = totalAmount - discountMaxValue;
    return {
      totalAmount,
      discountAmount,
      totalDiscount,
    };
  }

  /**
   * @description Delete a discount code
   * */
  static async deleteDiscountCode({ shopId, code }) {
    const deleted = await DiscountModel.findByIdAndDelete({
      discount_shopId: convertToObjetId(shopId),
      discount_code: code,
    });

    if (!deleted) {
      throw new HttpException(400, 'Discount code not found');
    }
    return deleted;
  }

  static async cancelDiscountCode({ shopId, code, userId }) {
    const foundDisCount = await checkDiscountExists({
      model: DiscountModel,
      filter: { discount_code: code, discount_shopId: convertToObjetId(shopId) },
    });

    if (!foundDisCount) {
      throw new HttpException(400, 'Discount code not found');
    }

    if (!foundDisCount.discount_is_active) {
      throw new HttpException(400, 'Discount code is not active');
    }

    const result = await DiscountModel.findByIdAndUpdate(foundDisCount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_uses_count: -1,
        discount_max_uses: 1,
      },
    });

    return result;
  }
}
export default DiscountService;
