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
  let valid = false;
  stripe.coupons.list((err, coupons) => {
    console.log(coupons);
    coupons.forEach(coupon => {
      if (coupon.id === id) valid = true;
    })
  });
  res.json({ valid });
}
