import Shop from '../models/shop';

export function uninstall(req, res) {
  console.log(req.headers['x-generated-signature']);
  console.log(req.headers['x-shopify-shop-domain'].split('.')[0]);
  if (req.headers['x-generated-signature'] === req.headers['x-shopify-hmac-sha256']) {
    console.log('UNINSTALL HOOKS');
    Shop.findOne({ name: req.headers['x-shopify-shop-domain'].split('.')[0] }, (err, s) => {
      if (err) console.log(err);
      if (s) {
        s.access_token = null;
        // s.accountType = null;
        // s.charge_id = null;
        s.installing = true;
        s.save().then(() => res.status(200).send({ success: true }));
      } else {
        console.log('Uninstall: could not find shop!');
        res.status(200).send({ success: true });
      }
    });
  } else {
    console.log('fail', req.headers['x-shopify-hmac-sha256']);
    res.status(422).send({ err: 'invalid source' });
  }
}
