const _ = require('lodash');
const Base = require('./base');

const API = 'http://opencellid.org/cell/get';

class OpenCellID extends Base {
  constructor(options) {
    super();
    this.key = options.key;
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
    return !_.has(body, 'error');
  }

  parseLocation(body) {
    return {
      longitude: body.lon,
      latitude: body.lat,
      accuracy: body.range,
    };
  }

  parseError(body) {
    return _.has(body, 'error') ? body.error : body;
  }
}

//  Exports
module.exports = OpenCellID;
