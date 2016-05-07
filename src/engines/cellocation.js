/* eslint strict:0 */
'use strict';

const _ = require('lodash');
const Base = require('./base');

const API = 'http://api.cellocation.com/cell/';

class Cellocation extends Base {
  constructor(options) {
    super();
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
      longitude: body.lon,
      latitude: body.lat,
      accuracy: body.radius,
      address: body.address,
    };
  }

  parseError(body) {
    return _.has(body, 'error') ? body.error : body;
  }
}

//  Exports
module.exports = Cellocation;
