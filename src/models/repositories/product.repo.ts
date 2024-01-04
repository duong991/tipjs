import { HttpException } from '@/helpers/exceptions/HttpException';
import {
  ProductModel,
  ClothingModel,
  ElectronicModel,
  FurnitureModel,
} from '@/models/product.model';
import { Types } from 'mongoose';
import { getSelectData, unGetSelectData } from '@/utils';

/*==========================Check=================================*/
const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne({ ...filter }).lean();
};
/*==========================Find=================================*/

const findAllDraftProductsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queyProduct({ query, limit, skip });
};

const findAllPublishProductsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queyProduct({ query, limit, skip });
};

const findAllProducts = async ({ limit = 50, sort = 'ctime', page = 1, filter, select }) => {
  const skip = (page - 1) * limit;
  const products = await ProductModel.find({ ...filter })
    .sort({ _id: sort === 'ctime' ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await ProductModel.findById(product_id).select(unGetSelectData(unSelect)).lean();
};
/*==========================Update=================================*/

const publicProductByShop = async ({ product_shop, product_id }) => {
  return await setPublishedStatusProductByShop({ product_shop, product_id, isPublished: true });
};

const unPublishedProductByShop = async ({ product_shop, product_id }) => {
  return await setPublishedStatusProductByShop({ product_shop, product_id, isPublished: false });
};

const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
  return await model.updateProductById(product_id, payload, { new: isNew });
};
/*==========================Search=================================*/

const searchProductByUser = async ({ keySearch, limit = 50, skip = 0 }) => {
  const regexSearch = new RegExp(keySearch);

  const results = await ProductModel.find(
    {
      isDraft: false,
      $text: { $search: regexSearch.toString() },
    },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .lean();

  return results;
};

/*==========================Delete=================================*/

/*==========================Utils=================================*/

const setPublishedStatusProductByShop = async ({ product_shop, product_id, isPublished }) => {
  const foundShop = await ProductModel.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundShop) throw new HttpException(404, 'Product not found');
  foundShop.isDraft = !isPublished;
  foundShop.isPublished = isPublished;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const queyProduct = async ({ query, limit, skip }) => {
  return await ProductModel.find({ ...query })
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export {
  checkDiscountExists,
  findAllDraftProductsForShop,
  findAllProducts,
  findProduct,
  findAllPublishProductsForShop,
  publicProductByShop,
  unPublishedProductByShop,
  searchProductByUser,
  updateProductById,
};
