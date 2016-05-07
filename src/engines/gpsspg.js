/* eslint strict:0 */
'use strict';

const _ = require('lodash');
const Base = require('./base');

const API = 'http://api.gpsspg.com/bs/';

class GPSspg extends Base {
  constructor(options) {
    super();
    if (options) {
      this.key = options.key;
      this.oid = options.oid;
      this.system = options.system;
    }
  }

  getRequestSettings(cell) {
    return {
      uri: API,
      qs: {
        oid: this.oid,
        type: '',
        mcc: cell.mcc,
        mnc: cell.mnc,
        a: cell.lac,
        b: cell.cid,
        //  0:WGS84; 1:Google Maps; 2:Baidu Maps; 3:QQ Maps; 4:MapBar
        to: this.system || 0,
        key: this.key,
        output: 'json',
      },
      json: true,
    };
  }

  validate(body) {
    return !_.has(body, 'error') && body.status === '200';
  }

  parseLocation(body) {
    return {
      longitude: body.result.lng,
      latitude: body.result.lat,
      accuracy: body.result.radius,
      address: body.result.address,
    };
  }

  parseError(body) {
    return _.has(body, 'status') ? body.status : body;
  }
}

//  Exports
module.exports = GPSspg;
