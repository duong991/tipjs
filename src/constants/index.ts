const RoleShop = {
  WRITER: '0000',
  SHOP: '1111',
  ADMIN: '2222',
};

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'refresh-token',
};

const _methods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const;

export { RoleShop, HEADER, _methods };
