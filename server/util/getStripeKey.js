'use strict';

module.exports = () => {
  console.log(process.env);
  if (process.env.NODE_ENV === 'production') {
    return process.env.STRIPE_SECRET;
  } else {
    return require('../../config/keys/stripe.js');
  }
};
