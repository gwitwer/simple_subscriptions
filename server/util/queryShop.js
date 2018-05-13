let testStore = {};
if (process.env.NODE_ENV !== 'production') {
  testStore = (require('../../config/keys/shopify').testStore);
}

module.exports = Shop => {

  const shopFinderDev = dev => f => (q, ...args) => {
    if (process.env.NODE_ENV === 'production') {
      return Shop[f](q, ...args).exec();
    }

    return new Promise(r => r(dev(testStore)));
  };

  const shopFinder = shopFinderDev(a => a);

  const findShopByName = name => shopFinder('findOne')({ name });
  const findShopById = shopFinder('findById');
  const findShopByNameAndUpdate = shopFinder('findOneAndUpdate');
  const findShopByIdAndUpdate = shopFinder('findByIdAndUpdate');
  const getAllShops = () => shopFinderDev(a => [ a ])('find')({});

  return {
    findShopByName,
    findShopById,
    findShopByNameAndUpdate,
    findShopByIdAndUpdate,
    getAllShops,
  };
};
