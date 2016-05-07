const _ = require('lodash');
const Base = require('./base');

const API = 'http://api.lbs.yandex.net/geolocation';

class Yandex extends Base {
  constructor(options) {
    super();
    if (options) {
      this.key = options.key;
    }
  }

  getRequestSettings(cell) {
    const json = {
      common: {
        version: '1.0',
        api_key: this.key,
      },
      gsm_cells: [{
        countrycode: cell.mcc,
        operatorid: cell.mnc,
        lac: cell.lac,
        cellid: cell.cid,
      }],
    };
    return {
      method: 'POST',
      uri: API,
      body: `json=${JSON.stringify(json)}`,
    };
  }

  preprocessBody(body) {
    return JSON.parse(body);
  }

  validate(body) {
    try {
      return !_.has(body, 'error') && (body.position.type !== 'ip');
    } catch (e) {
      return false;
    }
  }

  parseLocation(body) {
    return {
      longitude: body.position.longitude,
      latitude: body.position.latitude,
      accuracy: body.position.precision,
    };
  }

  parseError(body) {
    if (_.has(body, 'error')) {
      return `[${body.error.code}] ${body.error.text}`;
    }

    if (body.position.type === 'ip') {
      return 'Cell not found.';
    }

    return body;
  }
}

//  Exports
module.exports = Yandex;
