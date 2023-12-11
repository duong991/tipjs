import { InventoryModel } from '../inventory.model';

const insertInventory = async ({ product_id, shop_id, stock, location = 'unknown' }) => {
  return await InventoryModel.create({
    invent_product: product_id,
    invent_location: location,
    invent_stock: stock,
    invent_shopId: shop_id,
  });
};

export { insertInventory };
