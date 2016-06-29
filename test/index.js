/* eslint-disable */
'use strict';

const locator = require('../lib')
const expect = require('chai').expect;
const fs = require('fs');

let config = {};
try {
  config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));
} catch (e) {
  console.error('Cannot find `config.json`. Use ENV variable instead.');
  config.google_api_key = config.google_api_key || process.env.GOOGLE_API_KEY;
  config.mozilla_api_key = config.mozilla_api_key || process.env.MOZILLA_API_KEY;
  config.opencellid_key = config.opencellid_key || process.env.OPENCELLID_KEY;
  config.yandex_key = config.yandex_key || process.env.YANDEX_KEY;
  config.gpsspg_oid = config.gpsspg_oid || process.env.GPSSPG_OID;
  config.gpsspg_key = config.gpsspg_key || process.env.GPSSPG_KEY;
  config.haoservice_key = config.haoservice_key || process.env.HAOSERVICE_KEY;
}


const cells = [{
  mcc: 460,
  mnc: 0,
  lac: 4219,
  cid: 20925,
  latitude: 39.9910225,
  longitude: 116.4667949,
}, {
  mcc: 222,
  mnc: 10,
  lac: 10012,
  cid: 39309,
  latitude: 45.641612,
  longitude: 8.8117626,
}, {
  mcc: 262,
  mnc: 2,
  lac: 5313,
  cid: 131948771,
  latitude: 51.4484981,
  longitude: 7.2090162,
}, {
  mcc: 240,
  mnc: 1,
  lac: 3012,
  cid: 11950,
  latitude: 59.33171,
  longitude: 18.07907,
}, {
  mcc: 250,
  mnc: 2,
  lac: 7840,
  cid: 200719106,
  latitude: 60.0526889,
  longitude: 30.3799864,
}, {
  mcc: 460,
  mnc: 0,
  lac: 34860,
  cid: 62041,
  latitude: 22.0171793,
  longitude: 100.7515358,
}];

/* eslint-disable no-undef,no-unused-expressions */

function checkEngine(name, options, cell, extra) {
  it(`engine.locate() - '${name}' : ${JSON.stringify(cell)}`, (done) => {
    const engine = locator.createEngine(name, options);
    engine.locate(cell, (error, location) => {
      expect(error).to.be.null;
      expect(location).to.not.be.null;
      expect(location.latitude).to.be.within(-90, 90);
      expect(location.longitude).to.be.within(-180, 180);
      expect(location.accuracy).to.be.within(0, 10000);
      if (cell.latitude) {
        expect(location.latitude).to.be.within(cell.latitude - 0.02, cell.latitude + 0.02);
        expect(location.longitude).to.be.within(cell.longitude - 0.02, cell.longitude + 0.02);
      }
      if (extra) {
        extra(location);
      }
      done();
    });
  });
}

describe('Geolocation Engine', function () {
  this.timeout(10000);

  it('locator.createEngine()', () => {
    expect(locator.createEngine('google')).to.have.property('locate');
    expect(locator.createEngine('mozilla')).to.have.property('locate');
    expect(locator.createEngine('opencellid')).to.have.property('locate');
    expect(locator.createEngine('yandex')).to.have.property('locate');
    expect(locator.createEngine('cellocation')).to.have.property('locate');
    expect(locator.createEngine('gpsspg')).to.have.property('locate');
    expect(locator.createEngine('haoservice')).to.have.property('locate');
    expect(locator.createEngine('mylnikov')).to.have.property('locate');
  });

  //  Google
  describe('Google Geolocation', () => {
    checkEngine('google', {
      key: config.google_api_key,
    }, cells[0]);
    checkEngine('google', {
      key: config.google_api_key,
    }, cells[1]);
  });

  //  Mozilla
  describe.skip('Mozilla Geolocation', () => {
    checkEngine('mozilla', {
      key: config.mozilla_api_key,
    }, cells[3]);
  });

  //  OpenCellID
  describe('OpenCellID', () => {
    checkEngine('opencellid', {
      key: config.opencellid_key,
    }, cells[2]);
  });

  //  Yandex
  describe('Yandex', () => {
    checkEngine('yandex', {
      key: config.yandex_key,
    }, cells[4]);
  });

  //  Cellocation
  describe('Cellocation', () => {
    checkEngine('cellocation', {
      system: 'wgs84',
    }, cells[0]);
    // checkEngine('cellocation', {
    //   system: 'gcj02',
    // }, cells[0]);
    // checkEngine('cellocation', {
    //   system: 'bd09',
    // }, cells[0]);
  });

  //  GPSspg
  describe.skip('GPSspg.com', () => {
    checkEngine('gpsspg', {
      oid: config.gpsspg_oid,
      key: config.gpsspg_key,
    }, cells[5]);
  });

  //  HaoService
  describe.skip('HaoService.com', () => {
    checkEngine('haoservice', {
      key: config.haoservice_key,
    }, cells[0]);
  });

  //  Mylnikov
  describe('mylnikov.org', () => {
    checkEngine('mylnikov', null, cells[1]);
    checkEngine('mylnikov', null, cells[2]);
    checkEngine('mylnikov', null, cells[3]);
  });
});


/* eslint-enable no-undef */
