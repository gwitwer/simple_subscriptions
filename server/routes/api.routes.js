import * as ApiController from '../controllers/api.controller';

/**
 * Attach api routes to router
 * @param router
 * @returns void
 */
const apiRoutes = router => {
  router.get('/subscribe', (req, res) => red.redirect('/'));
  router.post('/subscribe', ApiController.postSubscribe);

  router.get('/verify/:coupon', ApiController.getVerifyCoupon);
};

export default apiRoutes;
