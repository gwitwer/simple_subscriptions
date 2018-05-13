import { Router } from 'express';
import authRoutes from  './auth.routes.js';
import hookRoutes from './hook.routes.js';

const api = new Router();
// postRoutes(api);
// gameRoutes(api);
// userRoutes(api);
// teamRoutes(api);

const auth = new Router();
authRoutes(auth);

const hooks = new Router();
hookRoutes(hooks);

export {
  api,
  auth,
  hooks,
};
