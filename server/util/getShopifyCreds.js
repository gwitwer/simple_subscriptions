'use strict';

module.exports = () => {
  console.log(process.env);
  const redirect_uri = process.env.SERVER === 'production'
                        ? 'https://simple-subscriptions.com'
                        : 'https://simple-subscriptions.com'
  if (process.env.NODE_ENV === 'production') {
    return {
      redirect_uri,
      key: process.env.SHOPIFY_KEY,
      secret: process.env.SHOPIFY_SECRET,
    };
  } else {
    return require('../../config/keys/shopify.js');
  }
};
