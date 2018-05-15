import * as ApiController from '../controllers/api.controller';

/**
 * Attach api routes to router
 * @param router
 * @returns void
 */
const apiRoutes = router => {
  router.get('/subscribe', (req, res) => red.redirect('/'));
  router.post('/subscribe', ApiController.postSubscribe);

  router.get('/verify/coupon/:coupon', ApiController.getVerifyCoupon);

  router.get('/verify/customer/:customer', ApiController.getVerifyCustomer);
};

export default apiRoutes;
