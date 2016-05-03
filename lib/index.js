const _ = require('lodash');

const GoogleGeolocation = require('./google-geolocation');
const OpenCellID = require('./opencellid');
const CellLocation = require('./celllocation');

class Geolocation {
  constructor(options) {
    if (_.isPlainObject(options)) {
      this.google = new GoogleGeolocation(options.google_api_key);
      this.opencellid = new OpenCellID(options.opencellid_key);
    }
    //  No key required
    this.celllocation = new CellLocation();
  }
}

module.exports = Geolocation;
