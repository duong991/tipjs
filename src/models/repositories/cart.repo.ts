import { convertToObjetId, unGetSelectData } from '@/utils';
import { CartModel } from '../cart.model';

const createUserCard = async ({ userId, product }) => {
  const query = {
      cart_state: 'active',
      cart_userId: userId,
    },
    updateOrInsert = {
      $addToSet: {
        cart_products: [product],
      },
    },
    options = {
      upsert: true,
      new: true,
    };

  return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const addNewProductToCart = async ({ userId, product }) => {
  const query = {
      cart_state: 'active',
      cart_userId: userId,
    },
    updateOrInsert = {
      $push: {
        cart_products: product,
      },
    },
    options = {
      upsert: true,
      new: true,
    };

  return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateProductQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
      cart_userId: userId,
      'cart_products.productId': convertToObjetId(productId),
    },
    update = {
      $inc: {
        'cart_products.$.quantity': quantity,
      },
    },
    options = {
      new: true,
    };

  return await CartModel.findOneAndUpdate(query, update, options);
};

const deleteUserCard = async ({ userId, productId }) => {
  const query = {
      cart_userId: userId,
      'cart_products.productId': convertToObjetId(productId),
      cart_state: 'active',
    },
    updateOrInsert = {
      $pull: {
        cart_products: {
          productId: convertToObjetId(productId),
        },
      },
    };
  return await CartModel.updateOne(query, updateOrInsert);
};

const findUserCart = async ({ userId, unSelect = [] }) => {
  return await CartModel.findOne({
    cart_userId: userId,
  })
    .select(unGetSelectData(unSelect))
    .lean();
};

export {
  createUserCard,
  addNewProductToCart,
  updateProductQuantity,
  deleteUserCard,
  findUserCart,
};
