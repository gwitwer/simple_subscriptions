const shopifyAPI = require('shopify-node-api');
const shopifyCreds = require('./getShopifyCreds.js')();

const makeShopify = shop => {
  console.log('make shopify', shop.name, shop.access_token, process.env.NODE_ENV);
  return new shopifyAPI({
    shop: shop.name,
    shopify_api_key: shopifyCreds.key,
    shopify_shared_secret: shopifyCreds.secret,
    access_token: shop.access_token
  });
  // } else {
  //   return new shopifyAPI({
  //     shop: shop.name,
  //     shopify_api_key: shopifyCreds.key,
  //     access_token: shopifyCreds.secret,
  //     redirect_uri: `${shopifyCreds.redirect_uri}/`,
  //     shopify_scope: 'read_customers, read_orders, read_themes, write_customers', // https://help.shopify.com/api/getting-started/authentication/oauth#scopes
  //     nonce: shop._id.toString()
  //   });
  // }
};

const makeShopifyPreAuth = shop => nonce => (
  new shopifyAPI({
    shop,
    nonce,
    shopify_api_key: shopifyCreds.key,
    access_token: shopifyCreds.secret,
    redirect_uri: `${shopifyCreds.redirect_uri}/finish_auth`,
    shopify_scope: 'read_customers, read_orders, read_themes, write_customers', // https://help.shopify.com/api/getting-started/authentication/oauth#scopes
  })
);

const makeShopifyPostAuth = shop => nonce => access_token => (
  new shopifyAPI({
    shop,
    access_token,
    nonce,
    shopify_api_key: shopifyCreds.key,
    shopify_shared_secret: shopifyCreds.secret,
  })
)

module.exports = {
  makeShopify,
  makeShopifyPreAuth,
  makeShopifyPostAuth,
};
