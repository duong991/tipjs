import { ShopModel } from '@/models/shop.model';

const findByEmail = async ({
  email,
  selected = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  const data = await ShopModel.findOne({ email }).select(selected).lean();
  return data;
};

export { findByEmail };
