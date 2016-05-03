const _ = require('lodash');

const GoogleGeolocation = require('./google-geolocation');

class Geolocation {
  constructor(options) {
    if (_.isPlainObject(options)) {
      this.google = new GoogleGeolocation(options.google_api_key);
    }
  }
}

module.exports = Geolocation;
