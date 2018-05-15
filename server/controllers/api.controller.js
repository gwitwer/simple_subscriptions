import stripePackage from 'stripe';
import getStripeKey from '../util/getStripeKey';
import Shop from '../models/shop';
import errRes from '../util/errRes';
const { findShopByName } = require('../util/queryShop')(Shop);
const { makeShopify } = require('../util/makeShopify');
const stripe = stripePackage(getStripeKey());

export function postSubscribe(req, res) {
  const {
    email,
    source,
    coupon,
    quantity,
    pass,
    shop,
    first_name,
    last_name,
  } = req.body;
  console.log(req.body);

  if (shop && shop.split('.').length) {
    findShopByName(shop.split('.')[0]).then(s => {
      console.log(s);
      const createCustomer = stripe.customers.create({
        email,
        source,
      });

      createCustomer.then(customer => {
        const createSubscription = stripe.subscriptions.create({
          coupon,
          quantity,
          customer: customer.id,
          plan: 'plan_CrdgURQLwHviS0', // boldmemberships_16604 // TODO: this is entered in the front-end of the app.
        });

        createSubscription.then(r => {
          console.log(r);
          // TODO: make shopify customer!
          if (s) {
            const Shopify = makeShopify(s);
            const cObj = {
              first_name,
              last_name,
              email,
              verified_email: true,
              metafields: [{
                key: 'stripe_customer_id',
                value: customer.id,
                value_type: 'string',
                namespace: 'global'
              }],
              password: pass,
              password_confirmation: pass,
              send_email_welcome: true,
            };
            console.log(cObj);
            Shopify.post('/admin/customers.json', { customer: cObj }, (err, shopifyResponse) => {
              if (err) {
                errRes(res)(err);
              } else {
                console.log(shopifyResponse);
                res.status(200).send({ success: true, madeCustomer: true });
              }
            });
          } else {
            res.status(200).send({ success: true, madeCustomer: false });
          }
        }).catch(errRes(res));
      }).catch(errRes(res));
    }).catch(errRes(res));
  }
};

export function getVerifyCoupon(req, res) {
  const id = req.params.coupon;
  let response = {
    id: null,
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
    if (!err) {
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
    } else {
      console.log(err);
    }

    res.json(response);
  });
}
