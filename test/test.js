const ml = require('../src');
const map = require('../src/mapservice');

// `config.json`:
// {
//   "google_api_key": "<YOUR_GOOGLE_API_KEY>",
//   "mozilla_api_key": "<YOUR_MOZILLA_KEY>"
//   "opencellid_key": "<YOUR_OPENCELLID_KEY>",
//   "yandex_key": "<YOUR_YANDEX_KEY>",
//   "gpsspg_oid": "<YOUR_GPSSPG_OID>",
//   "gpsspg_key": "<YOUR_GPSSPG_KEY>",
//   "haoservice_key": "<YOUR_HAOSERVICE_KEY>"
// }
const config = require('./config');

function test(cellInfo, name, options) {
  ml.createEngine(name, options)
    .locate(cellInfo, (error, location) => {
      console.log(`\n[${name}]`);
      if (error) {
        console.error(error);
      } else {
        console.log(`${JSON.stringify(location)}`);
        console.log(map.format('google', location));
        console.log(map.format('bing', location));
        console.log(map.format('google.cn', location));
        console.log(map.format('bing.cn', location));
        console.log(map.format('openstreetmap', location));
        console.log(map.format('baidu', location));
      }
    });
}

const data = {
  mcc: process.argv[2] ? process.argv[2] : 460,
  mnc: process.argv[3] ? process.argv[3] : 0,
  lac: process.argv[4] ? process.argv[4] : 4219,
  cid: process.argv[5] ? process.argv[5] : 20925,
};

console.log(data);

test(data, 'google', {
  key: config.google_api_key,
});

test(data, 'mozilla', {
  key: config.mozilla_api_key,
});

test(data, 'opencellid', {
  key: config.opencellid_key,
});

test(data, 'yandex', {
  key: config.yandex_key,
});

test(data, 'cellocation', {
  system: 'wgs84',
});

test(data, 'gpsspg', {
  oid: config.gpsspg_oid,
  key: config.gpsspg_key,
});

// test(data, 'haoservice', {
//   key: config.haoservice_key,
// });
