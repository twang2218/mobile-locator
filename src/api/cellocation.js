const has = require('lodash/has');
const Base = require('./base');

const API = 'http://api.cellocation.com:81/cell/';

/* eslint-disable class-methods-use-this */
class Cellocation extends Base {
  constructor(options) {
    super(options);
    if (options) {
      //  Coordinate System
      //  {'wgs84', 'gcj02', 'bd09'}
      this.system = options.system ? options.system : 'wgs84';
    }
  }

  getRequestSettings(cell) {
    return {
      uri: API,
      json: true,
      qs: {
        mcc: cell.mcc,
        mnc: cell.mnc,
        lac: cell.lac,
        ci: cell.cid,
        coord: this.system,
        output: 'json',
      },
    };
  }

  validate(body) {
    return (body.errcode === 0);
  }

  parseLocation(body) {
    return {
      longitude: parseFloat(body.lon),
      latitude: parseFloat(body.lat),
      accuracy: parseInt(body.radius, 10),
      address: body.address,
    };
  }

  parseError(body) {
    return has(body, 'error') ? body.error : body;
  }
}

module.exports = Cellocation;
