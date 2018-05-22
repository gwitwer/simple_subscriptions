'use strict';

module.exports = () => {
  console.log(process.env.REDIRECT_URI);
  let redirect_uri = 'http://localhost:8000';
  if (process.env.SERVER === 'production') {
    if (process.env.REDIRECT_URI) {
      redirect_uri = process.env.REDIRECT_URI;
    } else {
      redirect_uri = 'https://simple-subscriptions.com';
    }
  }

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
