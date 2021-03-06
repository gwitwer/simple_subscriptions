const shopifyCreds = require('./getShopifyCreds.js')();
const shopifyAPI = require('shopify-node-api');

module.exports = Shop => {
  const createNewAccountAndRedirect = (name, res, callback) => {
    console.log(shopifyCreds);
    console.log('CREATE_NEW_ACCOUNT_AND_REDIRECT');
    if (process.env.NODE_ENV !== 'production') {
      console.log('callback...');
      callback(shopifyCreds.testStore);
    } else {
      console.log(`FIND ${name}`);
      Shop.findOne({ name }, (err, shop) => {
        // console.log(!!shop, shop.access_token);
        // if (typeof(shop.installing) === 'undefined') {
        //   shop.installing = true;
        // }
        if (err) console.log('ERR: ', err);
        if (shop && shop.access_token && !shop.installing) {
          console.log('callback', shop.name, shop.access_token)
          callback(shop);
        } else if (shop && !shop.access_token) {
          const Shopify = new shopifyAPI({
            shop: name,
            shopify_api_key: shopifyCreds.key,
            access_token: shopifyCreds.secret,
            redirect_uri: `${shopifyCreds.redirect_uri}/auth/finish_auth/`,
            shopify_scope: 'read_customers, read_content, write_content, write_customers', // https://help.shopify.com/api/getting-started/authentication/oauth#scopes
            nonce: shop._id.toString()
          });
          const auth_url = Shopify.buildAuthURL();
          res.redirect(auth_url);
        } else {
          console.log('Creating new account for ' + name);
          (new Shop({ name, installing: true })).save((err, s) => {
            console.log(err, s);
            const Shopify = new shopifyAPI({
              shop: name,
              shopify_api_key: shopifyCreds.key,
              access_token: shopifyCreds.secret,
              redirect_uri: `${shopifyCreds.redirect_uri}/auth/finish_auth/`,
              shopify_scope: 'read_customers, read_content, write_content, write_customers', // https://help.shopify.com/api/getting-started/authentication/oauth#scopes
              nonce: s._id.toString()
            });
            const auth_url = Shopify.buildAuthURL();
            console.log(auth_url);
            res.redirect(auth_url);
          });
        }
      });
    }
  };

  return { createNewAccountAndRedirect };
};
