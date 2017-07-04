const has = require('lodash/has');
const Base = require('./base');

const API = 'https://unwiredlabs.com/v2/process.php';

/*
 * US East (Northern Virginia): https://us1.unwiredlabs.com/v2/process.php
 * US West (San Francisco): https://us2.unwiredlabs.com/v2/process.php
 * Europe (Ireland): https://eu1.unwiredlabs.com/v2/process.php
 * Asia Pacific (Singapore): https://ap1.unwiredlabs.com/v2/process.php
 */

/* eslint-disable class-methods-use-this */
class UnwiredLabs extends Base {
  constructor(options) {
    super(options);
    if (options) {
      this.token = options.token;
    }
  }

  getRequestSettings(cell) {
    return {
      method: 'POST',
      uri: API,
      json: {
        token: this.token,
        radio: 'gsm',
        mcc: cell.mcc,
        mnc: cell.mnc,
        cells: [{
          lac: cell.lac,
          cid: cell.cid,
        }],
        address: 1,
      },
    };
  }

  validate(body) {
    return (body.status === 'ok');
  }

  parseLocation(body) {
    return {
      longitude: parseFloat(body.lon),
      latitude: parseFloat(body.lat),
      accuracy: parseInt(body.accuracy, 10),
      address: body.address,
    };
  }

  parseError(body) {
    return has(body, 'status') && body.status === 'error' ? body.message : body;
  }
}

module.exports = UnwiredLabs;
