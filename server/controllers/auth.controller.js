import User from '../models/user';
import Shop from '../models/shop';
import cuid from 'cuid';
import {
  makeHash,
  checkHash,
} from '../util/hashing';

const {
  makeShopify,
  makeShopifyPreAuth,
  makeShopifyPostAuth
} = require('../util/makeShopify');

const { createNewAccountAndRedirect } = require('../util/createNewAccountAndRedirect')(Shop);

const appName = 'simple-subscriptions';

const {
  findShopById,
  findShopByName,
  findShopByNameAndUpdate,
  findShopByIdAndUpdate,
  getAllShops,
} = require('../util/queryShop')(Shop);

const shopifyCreds = require('../util/getShopifyCreds')();

export function getLogin(req, res) {
  // Shop
  //   .remove({ name: 'demo-store-accept-my-marketing' }).exec()
  //   .then(() => Shop.remove({ name: 'amm-test-1' }).exec())
  //   .then(() => Shop.find({}).exec())
  //   .then(shops => {
  //     console.log(shops);
  //     res.render('login');
  //   });
  res.render('login');
}

export function postLogin(req, res) {
  const { email, pass } = req.body;
  const findUser = User.findOne({ email }).exec();
  findUser.then(user => {
    if (user) {
      if (checkHash(pass)(user.pass)) {
        req.session.user = { email: user.email, type: user.type, cuid: user.cuid }; // eslint-disable-line no-param-reassign
        res.status(200).send({ success: true });
      } else {
        res.status(200).send({ err: 'Incorrect password for this user' });
      }
    } else {
      res.status(200).send({ err: 'No user found with that email address.' });
    }
  }).catch(err => {
    res.status(200).send({ err });
  });
}

export function getSignupShop(req, res) {
  createNewAccountAndRedirect(req.params.shop.split('.')[0], res, () => {
    const query = process.env.NODE_ENV === 'production' ? req.query : shopifyCreds.params;
    console.log('CALLBACK', query);
    console.log(require('url').format({
      pathname:'/',
      query
    }));
    res.redirect(require('url').format({
      pathname:'/',
      query
    }));
  });
};

export function getFinishAuth(req, res) {
  console.log('>>>>>>>>> FINISH AUTH???');
  const query = process.env.NODE_ENV === 'production' ? req.query : shopifyCreds.params;
  if (!query.shop) {
    res.redirect('/login');
    return;
  }

  const name = query.shop.split('.')[0];
  console.log('FINISH_AUTH FOR ' + name);

  Shop.findOne({ name }, (err, shop) => {
    if (shop) {
      const Shopify = makeShopifyPostAuth(name)(shop._id.toString())(query.code);
      console.log(shop)
      if (shop.installing) {
        Shopify.exchange_temporary_token(query, (err, data) => {
          console.log('here', data);
          if (data && data.access_token) {
            shop.access_token = data.access_token;
            shop.installing = false;
            shop.save(err => {
              if (err) {
                console.log('????', err);
              }

              const NewShopify = makeShopify(shop);
              NewShopify.post('/admin/webhooks.json', {
                webhook: {
                  address: `https://${appName}.com/hooks/uninstall`,
                  topic: 'app/uninstalled'
                }
              }, response => {
                console.log(response);
                console.log('created uninstall hook, redirecting to app');
                if (true || isValidAccount(shop)) {
                  res.redirect(`https://${name}.myshopify.com/admin/apps/${appName}`);
                } else {
                  upgradeAccount(shop, (error, response) => res.redirect(response.recurring_application_charge.confirmation_url));
                }
              });
            });
          } else {
            console.log('err', err);
          }
        });
      } else {
        console.log('Already did "finish_auth"');
        if (true || isValidAccount(shop)) {
          // Make page for checkout here? no -- don't create page automatically.
          res.redirect(`https://${name}.myshopify.com/admin/apps/${appName}`);
        } else {
          upgradeAccount(shop, (error, response) => res.redirect(response.recurring_application_charge.confirmation_url));
        }
      }
    } else {
      res.redirect('/auth/login');
    }
  });
}

export function getLogout(req, res) {
  delete req.session.user; // eslint-disable-line no-param-reassign
  res.redirect('/auth/login');
}
