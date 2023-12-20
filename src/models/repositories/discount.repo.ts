import { convertToObjetId, unGetSelectData, getSelectData } from '@/utils';
import { DiscountModel } from '@/models/discount.model';
const fountDiscount = async ({ code, shopId }) =>
  await DiscountModel.findOne({
    discount_code: code,
    discount_shopId: convertToObjetId(shopId),
  }).lean();

const findAllDiscountCodeUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', unSelect = [], filter }) => {
  const skip = (page - 1) * limit;
  return await DiscountModel.find({ ...filter })
    .sort({ _id: sort === 'ctime' ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
};

export { fountDiscount, findAllDiscountCodeUnSelect };
