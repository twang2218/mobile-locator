const Base = require('./base');

const API = 'http://api.lbs.yandex.net/geolocation';

/* eslint-disable class-methods-use-this */
class Yandex extends Base {
  constructor(options) {
    super(options);
    if (options) {
      this.key = options.key;
    }
  }

  getRequestSettings({
    cellId,
    locationAreaCode,
    mobileCountryCode,
    mobileNetworkCode,
  }) {
    const json = {
      common: {
        version: '1.0',
        api_key: this.key,
      },
      gsm_cells: [{
        countrycode: mobileCountryCode,
        operatorid: mobileNetworkCode,
        lac: locationAreaCode,
        cellid: cellId,
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
      return !has(body, 'error') && (body.position.type !== 'ip');
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
    const isErrorDefined = body?.error;
    if (isErrorDefined) return `[${body.error.code}] ${body.error.text}`;

    const isPositionTypeIp = body.position.type === 'ip'
    if (isPositionTypeIp) return 'Cell not found.';

    return body;
  }
}

module.exports = Yandex;
