const cl = require('../lib');

// `config.json`:
// {
//     "keys": {
//         "google_api_key": "<YOUR_GOOGLE_API_KEY>",
//         "mozilla_api_key": "<YOUR_MOZILLA_KEY>"
//         "opencellid_key": "<YOUR_OPENCELLID_KEY>",
//         "yandex_key": "<YOUR_YANDEX_KEY>",
//         "gpsspg_oid": "<YOUR_GPSSPG_OID>",
//         "gpsspg_key": "<YOUR_GPSSPG_KEY>",
//         "haoservice_key": "<YOUR_HAOSERVICE_KEY>"
//     }
// }
const config = require('./config');

function onResponse(error, location) {
  if (error) {
    console.error(error);
  } else {
    console.log(`${JSON.stringify(location)}`);
    console.log(
      `\thttps://www.google.com/maps/@${location.latitude},${location.longitude},${location.accuracy}m/data=!3m1!1e3`
    );
    console.log(`\thttps://www.bing.com/maps/?v=2&cp=${location.latitude}~${location.longitude}&style=h&lvl=15`);
    console.log(
      `\thttp://www.google.cn/maps/@${location.latitude},${location.longitude},${location.accuracy}m/data=!3m1!1e3`);
    console.log(`\thttps://www.bing.com/ditu/?v=2&cp=${location.latitude}~${location.longitude}&style=h&lvl=15`);
  }
}

function test(cellInfo, name, options) {
  cl.createService(name, options)
    .locate(cellInfo, (error, location) => {
      console.log(`\n[${name}]`);
      onResponse(error, location);
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
  key: config.keys.google_api_key,
});

test(data, 'mozilla', {
  key: config.keys.mozilla_api_key,
});

test(data, 'opencellid', {
  key: config.keys.opencellid_key,
});

test(data, 'yandex', {
  key: config.keys.yandex_key,
});

test(data, 'celllocation');

test(data, 'gpsspg', {
  oid: config.keys.gpsspg_oid,
  key: config.keys.gpsspg_key,
});

// test(data, 'haoservice', {
//   key: config.keys.haoservice_key,
// });
