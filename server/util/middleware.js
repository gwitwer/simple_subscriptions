const { makeShopify } = require('./makeShopify');

module.exports = ({ createNewAccountAndRedirect }) => {

  const isAdmin = (req, res, next) => {
    if (false) {
      next();
    } else {
      res.redirect('/adminLogin');
    }
  };

  const isLoggedIn = (req, res, next) => {
    console.log('CHECK LOGGED IN')
    if (req.query.shop) {
      createNewAccountAndRedirect(req.query.shop.split('.')[0], res, shop => {
        const Shopify = makeShopify(shop);
        if (Shopify.is_valid_signature(req.query) || process.env.NODE_ENV !== 'production') {
          next();
        } else {
          res.redirect('/invalidSource');
        }
      });
    } else {
      res.redirect('/login');
    }
  };

  return {
    isAdmin,
    isLoggedIn,
  };
};
