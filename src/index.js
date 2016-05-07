/* eslint strict:0 */
'use strict';

const GoogleGeolocation = require('./engines/google-geolocation');
const MozillaGeolocation = require('./engines/mozilla-geolocation');
const OpenCellID = require('./engines/opencellid');
const Yandex = require('./engines/yandex');
const Cellocation = require('./engines/cellocation');
const GPSspg = require('./engines/gpsspg');
const HaoService = require('./engines/haoservice');

class LocatorManager {
  constructor() {
    this.engines = [];
    //  register existing services
    this.register('google', GoogleGeolocation);
    this.register('mozilla', MozillaGeolocation);
    this.register('opencellid', OpenCellID);
    this.register('yandex', Yandex);
    this.register('cellocation', Cellocation);
    this.register('gpsspg', GPSspg);
    this.register('haoservice', HaoService);
  }
  register(name, engine) {
    this.engines[name] = engine;
  }
  unregister(name) {
    delete this.engines[name];
  }
  createEngine(name, options) {
    if (this.engines[name]) {
      return new this.engines[name](options);
    }
    return null;
  }
}

module.exports = new LocatorManager();
