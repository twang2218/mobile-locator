const has = require('lodash/has');
const Base = require('./base');

const API = 'http://opencellid.org/cell/get';

/* eslint-disable class-methods-use-this */
class OpenCellID extends Base {
  constructor(options) {
    super(options);
    if (options) {
      this.key = options.key;
    }
  }

  getRequestSettings(cell) {
    return {
      uri: API,
      json: true,
      qs: {
        key: this.key,
        mcc: cell.mcc,
        mnc: cell.mnc,
        lac: cell.lac,
        cellid: cell.cid,
        format: 'json',
      },
    };
  }

  validate(body) {
    return !has(body, 'error');
  }

  parseLocation(body) {
    return {
      longitude: body.lon,
      latitude: body.lat,
      accuracy: body.range,
    };
  }

  parseError(body) {
    return has(body, 'error') ? body.error : body;
  }
}

module.exports = OpenCellID;
