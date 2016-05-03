const _ = require('lodash');

const GoogleGeolocation = require('./google-geolocation');
const OpenCellID = require('./opencellid');

class Geolocation {
  constructor(options) {
    if (_.isPlainObject(options)) {
      this.google = new GoogleGeolocation(options.google_api_key);
      this.opencellid = new OpenCellID(options.opencellid_key);
    }
  }
}

module.exports = Geolocation;
