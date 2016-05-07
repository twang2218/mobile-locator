/* eslint strict:0 */
'use strict';

const _ = require('lodash');
const Base = require('./base');

const API = 'http://api.haoservice.com/api/getlbs';

class HaoService extends Base {

  constructor(options) {
    super();
    if (options) {
      this.key = options.key;
      this.system = options.system;
    }
  }

  getRequestSettings(cell) {
    return {
      uri: API,
      qs: {
        oid: this.oid,
        mcc: cell.mcc,
        mnc: cell.mnc,
        lac: cell.lac,
        cell_id: cell.cid,
        key: this.key,
        type: this.system || 2,
        output: 'json',
      },
      json: true,
    };
  }

  validate(body) {
    return body.ErrCode === '0';
  }

  parseLocation(body) {
    return {
      longitude: body.location.longitude,
      latitude: body.location.latitude,
      accuracy: body.location.accuracy,
      address: body.location.addressDescription,
    };
  }

  parseError(body) {
    return _.has(body, 'ErrCode') ? body.ErrCode : body;
  }
}

//  Exports
module.exports = HaoService;
