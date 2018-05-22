'use strict';

module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.STRIPE_SECRET;
  } else {
    return require('../../config/keys/stripe.js');
  }
};
