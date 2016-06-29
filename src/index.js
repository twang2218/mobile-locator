import GoogleGeolocation from './engines/google-geolocation';
import MozillaGeolocation from './engines/mozilla-geolocation';
import OpenCellID from './engines/opencellid';
import Yandex from './engines/yandex';
import Cellocation from './engines/cellocation';
import GPSspg from './engines/gpsspg';
import HaoService from './engines/haoservice';
import Mylnikov from './engines/mylnikov';

import MapServices from './mapservice';

export class LocatorManager {
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
    this.register('mylnikov', Mylnikov);
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

export const locator = new LocatorManager();
export default locator;
export const map = new MapServices();
