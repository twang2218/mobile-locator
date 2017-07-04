const has = require('lodash/has');
const Base = require('./base');

const API = 'https://api.mylnikov.org/geolocation/cell';
const API_VERSION = '1.1';

/* eslint-disable class-methods-use-this */
class Mylnikov extends Base {
  constructor(options) {
    super(options);
    if (options) {
      if (options.data) {
        this.data = options.data;
      }
    }
  }

  getRequestSettings(cell) {
    return {
      uri: API,
      json: true,
      qs: {
        v: API_VERSION,
        data: this.data,
        mcc: cell.mcc,
        mnc: cell.mnc,
        lac: cell.lac,
        cellid: cell.cid,
      },
    };
  }

  validate(body) {
    return (body.result === 200);
  }

  parseLocation(body) {
    return {
      longitude: body.data.lon,
      latitude: body.data.lat,
      accuracy: body.data.range,
    };
  }

  parseError(body) {
    return has(body, 'desc') ? body.desc : body;
  }
}

module.exports = Mylnikov;
