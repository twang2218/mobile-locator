const map = require('./mapservice');

/* eslint-disable global-require */
const Locators = {
  cellocation: require('./api/cellocation'),
  google: require('./api/google-geolocation'),
  gpsspg: require('./api/gpsspg'),
  haoservice: require('./api/haoservice'),
  mozilla: require('./api/mozilla-geolocation'),
  mylnikov: require('./api/mylnikov'),
  opencellid: require('./api/opencellid'),
  unwiredlabs: require('./api/unwiredlabs'),
  yandex: require('./api/yandex'),
};

const api = (service, options) => {
  const locator = new Locators[service](options);
  return (cell, callback) => locator.locate(cell, callback);
};

module.exports = {
  api,
  map,
};
