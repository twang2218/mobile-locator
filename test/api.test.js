/* eslint-disable no-undef */

const api = require('../src');
const debug = require('debug')('mobile-locator');

const config = {
  google_api_key: process.env.GOOGLE_API_KEY,
  gpsspg_oid: process.env.GPSSPG_OID,
  gpsspg_key: process.env.GPSSPG_KEY,
  haoservice_key: process.env.HAOSERVICE_KEY,
  mozilla_api_key: process.env.MOZILLA_API_KEY,
  opencellid_key: process.env.OPENCELLID_KEY,
  unwiredlabs_token: process.env.UNWIREDLABS_TOKEN,
  yandex_key: process.env.YANDEX_KEY,
};

const cells = [
  {
    mcc: 460,
    mnc: 0,
    lac: 4219,
    cid: 20925,
    latitude: 39.9910225,
    longitude: 116.4667949,
  },
  {
    mcc: 222,
    mnc: 10,
    lac: 10012,
    cid: 39309,
    latitude: 45.641612,
    longitude: 8.8117626,
  },
  {
    mcc: 262,
    mnc: 2,
    lac: 5313,
    cid: 131948771,
    latitude: 51.4484981,
    longitude: 7.2090162,
  },
  {
    mcc: 240,
    mnc: 1,
    lac: 3012,
    cid: 11950,
    latitude: 59.33171,
    longitude: 18.07907,
  },
  {
    mcc: 250,
    mnc: 2,
    lac: 7840,
    cid: 200719106,
    latitude: 60.0526889,
    longitude: 30.3799864,
  },
  {
    mcc: 460,
    mnc: 0,
    lac: 34860,
    cid: 62041,
    latitude: 22.0171793,
    longitude: 100.7515358,
  },
];

expect.extend({
  toBeWithin(received, start, finish) {
    if (received < start) {
      return {
        message: () => `expected ${received} not to be less than ${start}`,
        pass: false,
      };
    } else if (received > finish) {
      return {
        message: () => `expected ${received} not to be greater than ${finish}`,
        pass: false,
      };
    }
    return {
      message: () => `expected ${received} to be >= ${start} and <= ${finish}`,
      pass: true,
    };
  },
});

function checkEngine(name, options, cell, extra) {
  it(
    `locate() - '${name}' : ${JSON.stringify(cell)}`,
    () => {
      debug(`locate() => name: '${name}', options: '${JSON.stringify(options)}'), cell: '${JSON.stringify(cell)}, extra: '${JSON.stringify(extra)}' `);
      const locate = api(name, options);

      expect.assertions(7);
      return expect(locate(cell)
        .then((location) => {
          expect(location).toBeDefined();
          expect(location.latitude).toBeWithin(-90, 90);
          expect(location.longitude).toBeWithin(-180, 180);
          expect(location.accuracy).toBeWithin(0, 10000);
          if (cell.latitude) {
            expect(location.latitude).toBeCloseTo(cell.latitude, 1);
            expect(location.longitude).toBeCloseTo(cell.longitude, 1);
          }
          if (extra) {
            extra(location);
          }
          return location;
        })
        .catch((error) => {
          debug(error);
          throw error;
        })).resolves.toBeDefined();
    },
    20000,
  );
}

/* eslint-disable func-names */
describe('Geolocation Engine', () => {
  describe('Engine creation', () => {
    [
      'cellocation',
      'google',
      'gpsspg',
      'haoservice',
      'mozilla',
      'mylnikov',
      'opencellid',
      'unwiredlabs',
      'yandex',
    ].forEach((name) => {
      it(`api(${name}) should contain 'locate()' function`, () => {
        expect(api(name)).toEqual(expect.any(Function));
      });
    });
  });

  //  Cellocation
  describe('Cellocation', () => {
    checkEngine('cellocation', { system: 'wgs84' }, cells[0]);
    checkEngine('cellocation', { system: 'gcj02' }, cells[0]);
    checkEngine('cellocation', { system: 'bd09' }, cells[0]);
  });

  //  Google
  describe('Google Geolocation', () => {
    checkEngine('google', { key: config.google_api_key }, cells[0]);
    checkEngine('google', { key: config.google_api_key }, cells[1]);
  });

  //  GPSspg
  describe.skip('GPSspg.com', () => {
    checkEngine('gpsspg', { oid: config.gpsspg_oid, key: config.gpsspg_key }, cells[5]);
  });

  //  HaoService
  describe.skip('HaoService.com', () => {
    checkEngine('haoservice', { key: config.haoservice_key }, cells[0]);
  });

  //  Mozilla
  describe.skip('Mozilla Geolocation', () => {
    checkEngine('mozilla', { key: config.mozilla_api_key }, cells[3]);
  });

  //  Mylnikov
  describe('mylnikov.org', () => {
    checkEngine('mylnikov', null, cells[0]);
    checkEngine('mylnikov', null, cells[1]);
    checkEngine('mylnikov', { data: 'open' }, cells[2]);
    checkEngine('mylnikov', null, cells[3]);
  });

  //  OpenCellID
  describe('OpenCellID', () => {
    checkEngine('opencellid', { key: config.opencellid_key }, cells[2]);
  });

  //  UnwiredLabs
  describe('unwiredlabs.com', () => {
    checkEngine('unwiredlabs', { token: config.unwiredlabs_token }, cells[0]);
    checkEngine('unwiredlabs', { token: config.unwiredlabs_token }, cells[1]);
    checkEngine('unwiredlabs', { token: config.unwiredlabs_token }, cells[2]);
  });

  //  Yandex
  describe('Yandex', () => {
    checkEngine('yandex', { key: config.yandex_key }, cells[4]);
  });

  //  Test timeout
  describe('Timeout', () => {
    it('locate() - "cellocation" with timeout', () => {
      const locate = api('cellocation', { timeout: 1, system: 'wgs84' });
      expect.assertions(1);
      return expect(locate(cells[0])).rejects.toEqual(expect.objectContaining({
        message: expect.stringMatching(/timeout/i),
      }));
    });
  });
});
