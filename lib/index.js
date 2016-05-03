const _ = require('lodash');

const GoogleGeolocation = require('./google-geolocation');
const MozillaGeolocation = require('./mozilla-geolocation');
const OpenCellID = require('./opencellid');
const CellLocation = require('./celllocation');
const GPSspg = require('./gpsspg');
const HaoService = require('./haoservice');

class Geolocation {
  constructor(options) {
    if (_.isPlainObject(options)) {
      this.google = new GoogleGeolocation(options.google_api_key);
      this.mozilla = new MozillaGeolocation(options.mozilla_api_key);
      this.opencellid = new OpenCellID(options.opencellid_key);
      this.gpsspg = new GPSspg(options.gpsspg_oid, options.gpsspg_key);
      this.haoservice = new HaoService(options.haoservice_key);
    }
    //  No key required
    this.celllocation = new CellLocation();
  }
}

module.exports = Geolocation;
