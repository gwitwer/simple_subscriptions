import { Router } from 'express';
import authRoutes from  './auth.routes.js';

const api = new Router();
// postRoutes(api);
// gameRoutes(api);
// userRoutes(api);
// teamRoutes(api);

const auth = new Router();
authRoutes(auth);

export {
  api,
  auth,
};
