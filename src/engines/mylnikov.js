import _ from 'lodash';
import Base from './base';

const API = 'https://api.mylnikov.org/geolocation/cell';
const API_VERSION = '1.1';

export default class Mylnikov extends Base {
  getRequestSettings(cell) {
    return {
      uri: API,
      json: true,
      qs: {
        v: API_VERSION,
        data: 'open',
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
    return _.has(body, 'desc') ? body.desc : body;
  }
}
