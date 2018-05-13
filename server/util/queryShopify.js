

const getTheme = Shopify => shopName => data => {
  return new Promise((resolve, reject) => {
    Shopify.get('/admin/themes.json', (err, response) => {
      if (err) {
        reject(err);
      } else {
        const activeThemeId = response.themes.filter(t => t.role === 'main')[0].id;
        resolve(Object.assign({}, data, { shopName, activeThemeId }));
      }
    });
  });
};

const acceptMarketingForCustomer = Shopify => id => {
  return new Promise(r => {
    Shopify.put(`/admin/customers/${id}.json`, {
      customer: {
        id,
        accepts_marketing: true
      }
    }, (err, data) => {
      if (err) console.log(err);
      console.log(data);
      r();
    });
  });
};

const getCustomerAcceptsMarketing = Shopify => custId => callback => {
  Shopify.get(`/admin/customers.json?ids=${custId}`, (err, data) => {
    if (err) console.log(err);
    if (data) {
      callback(data.customers && data.customers.length && data.customers[0].accepts_marketing);
    } else {
      console.log('Failed with Customer ID ' + custId);
      callback(true);
    }
  });
};

module.exports = {
  getTheme,
  acceptMarketingForCustomer,
  getCustomerAcceptsMarketing,
};
