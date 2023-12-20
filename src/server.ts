import { App } from '@/app';
import { AuthRoute } from '@/api/routes/auth.route';
import { ProductRoute } from './api/routes/product.route';
import { ValidateEnv } from '@utils/validateEnv';
import { DiscountRoute } from './api/routes/discount.router';

ValidateEnv();

const app = new App([new AuthRoute(), new ProductRoute(), new DiscountRoute()]);

app.listen();
