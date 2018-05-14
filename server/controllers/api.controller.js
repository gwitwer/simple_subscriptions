import stripePackage from 'stripe';
import getStripeKey from '../util/getStripeKey';
const stripe = stripePackage(getStripeKey());

export function postSubscribe(req, res) {
  console.log(req.body);
  res.status(200).send({ success: true });
};

export function getVerifyCoupon(req, res) {
  console.log(req.params);
  const id = req.params.coupon;
  let response = {
    valid: false,
    percent_off: 0,
    amt_off: 0,
  };
  stripe.coupons.list((err, coupons) => {
    console.log(coupons);
    coupons.data.forEach(coupon => {
      if (coupon.id === id) {
        Object.keys(response).forEach(k => {
          response[k] = coupon[k];
        });
        console.log(response);
      }
    });

    res.json(response);
  });
}
