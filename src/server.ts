import { App } from '@/app';
import { AuthRoute } from '@/api/routes/auth.route';
import { ProductRoute } from './api/routes/product.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new AuthRoute(), new ProductRoute()]);

app.listen();
