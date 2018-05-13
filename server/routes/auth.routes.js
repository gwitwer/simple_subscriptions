import * as AuthController from '../controllers/auth.controller';

/**
 * Attach auth routes to router
 * @param router
 * @returns void
 */
const authRoutes = router => {
  router.get('/login', AuthController.getLogin);
  router.post('/login', AuthController.postLogin);

  router.get('/signup/:shop', AuthController.getSignupShop);
  router.get('/finish_auth', AuthController.getFinishAuth);

  router.get('/logout', AuthController.getLogout);
};

export default authRoutes;
