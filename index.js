const Geolocation = require('./lib');

// `config.json`:
// {
//     "keys": {
//         "google_api_key": "<YOUR_GOOGLE_API_KEY>",
//         "mozilla_api_key": "<YOUR_MOZILLA_KEY>"
//         "opencellid_key": "<YOUR_OPENCELLID_KEY>",
//         "gpsspg_oid": "<YOUR_GPSSPG_OID>",
//         "gpsspg_key": "<YOUR_GPSSPG_KEY>"
//     }
// }
const config = require('./config');

const locate = new Geolocation(config.keys);

function onResponse(error, location) {
  if (error) {
    console.error(error);
  } else {
    console.log();
    console.log(JSON.stringify(location));
    console.log();
    console.log(
      `https://www.google.com/maps/@${location.latitude},${location.longitude},${location.accuracy}m/data=!3m1!1e3`);
    console.log(`https://www.bing.com/maps/?v=2&cp=${location.latitude}~${location.longitude}&style=h&lvl=15`);
    console.log(
      `http://www.google.cn/maps/@${location.latitude},${location.longitude},${location.accuracy}m/data=!3m1!1e3`);
    console.log(`https://www.bing.com/ditu/?v=2&cp=${location.latitude}~${location.longitude}&style=h&lvl=15`);
  }
}

function test(cellInfo, tag, service) {
  service.locate(cellInfo, (error, location) => {
    console.log(`\n[${tag}]`);
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
test(data, 'Google API', locate.google);
test(data, 'Mozilla API', locate.mozilla);
test(data, 'OpenCellID API', locate.opencellid);
test(data, 'Yandex API', locate.yandex);
test(data, 'CellLocation.com API', locate.celllocation);
test(data, 'GPSspg.com API', locate.gpsspg);
//test(data, 'HaoService.com API', locate.haoservice);
