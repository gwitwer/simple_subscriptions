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
    amount_off: 0,
    duration: 0, // forever, once, or repeating
    duration_in_months: 0, // if repeating, this is the length of repetition.
    // redeem_by: 0, // need to multiply by 1000 for js
    // max_redemptions: 0, // null for unlimited, otherwise is > 0
    // times_redeemed: 0, // if max_redemptions > 0, times_redeemed must be less than max_redemptions
  };
  stripe.coupons.list((err, coupons) => {
    console.log(coupons);
    coupons.data.forEach(coupon => {
      if (coupon.id === id) {
        Object.keys(response).forEach(k => {
          response[k] = coupon[k];
        });
        response.valid = (
          coupon.valid &&
          (
            !coupon.max_redemptions ||
            (coupon.max_redemptions > 0 && coupon.max_redemptions > coupon.times_redeemed)
          ) &&
          (
            !coupon.redeem_by ||
            (Date.now() < (coupon.redeem_by * 1000))
          )
        );
        console.log(response);
      }
    });

    res.json(response);
  });
}
