import * as ApiController from '../controllers/api.controller';

const testBody = {
  email: 'david@mavenly.com',
  source: '',
  coupon: '123',
  quantity: 1,
  pass: 'asdasd',
  shop: '2nd-mavenly-test-store',
  first_name: 'David',
  last_name: 'Witwer',
  detail: 'asdasdasd',
  plan: '1',
};

// TODO: run this with test stripe keys and generate a test source.
const testSubscribe = run => body => {
  if (run) {
    const req = { body };
    const res = {
      status: () => ({ send: console.log }),
    };
    ApiController.postSubscribe(req, res);
  }
};

/**
 * Attach api routes to router
 * @param router
 * @returns void
 */
const apiRoutes = router => {

  testSubscribe(false)(testBody);

  router.get('/subscribe', (req, res) => red.redirect('/'));
  router.post('/subscribe', ApiController.postSubscribe);

  router.get('/verify/coupon/:coupon', ApiController.getVerifyCoupon);

  router.post('/verify/customer', ApiController.postVerifyCustomer);
};

export default apiRoutes;
