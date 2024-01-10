export interface route {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  handler: any;
  middlewares?: any[];
}
