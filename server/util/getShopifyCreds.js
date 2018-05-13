'use strict';

module.exports = () => {
  const redirect_uri = process.env.SERVER === 'production'
                        ? 'http://simple-subscriptions.com/'
                        : 'http://simple-subscriptions.com/'
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
