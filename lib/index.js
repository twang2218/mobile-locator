const GoogleGeolocation = require('./google-geolocation');
const MozillaGeolocation = require('./mozilla-geolocation');
const OpenCellID = require('./opencellid');
const Yandex = require('./yandex');
const CellLocation = require('./celllocation');
const GPSspg = require('./gpsspg');
const HaoService = require('./haoservice');

class CellLocator {
  constructor() {
    this.services = [];
    //  registe existing services
    this.register('google', GoogleGeolocation);
    this.register('mozilla', MozillaGeolocation);
    this.register('opencellid', OpenCellID);
    this.register('yandex', Yandex);
    this.register('celllocation', CellLocation);
    this.register('gpsspg', GPSspg);
    this.register('haoservice', HaoService);
  }
  register(name, service) {
    this.services[name] = service;
  }
  unregister(name) {
    delete this.services[name];
  }
  createService(name, options) {
    if (this.services[name]) {
      return new this.services[name](options);
    }
    return null;
  }
}

module.exports = new CellLocator();
