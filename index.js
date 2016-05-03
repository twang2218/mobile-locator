const Geolocation = require('./lib');

// `config.json`:
// {
//     "keys": {
//         "google_api_key": "<YOUR_GOOGLE_API_KEY>",
//         "opencellid_key": "<YOUR_OPENCELLID_KEY>"
//     }
// }
const config = require('./config');

const locate = new Geolocation(config.keys);

const data = {
  mcc: 460,
  mnc: 1,
  lac: 4219,
  cid: 20925,
};

function onResponse(error, location) {
  if (error) {
    console.error(error);
  } else {
    console.log();
    console.log(JSON.stringify(location));
    console.log();
    console.log(
      `https://www.google.com/maps/@${location.latitude},${location.longitiude},${location.accuracy}m/data=!3m1!1e3`);
    console.log(
      `http://www.google.cn/maps/@${location.latitude},${location.longitiude},${location.accuracy}m/data=!3m1!1e3`);
    console.log(`https://www.bing.com/maps/?v=2&cp=${location.latitude}~${location.longitiude}&style=h&lvl=12`);
  }
}

function test(cellInfo, tag, service) {
  service.locate(cellInfo, (error, location) => {
    console.log(`\n[${tag}]`);
    onResponse(error, location);
  });
}

test(data, 'Google API', locate.google);
test(data, 'Mozilla API', locate.mozilla);
test(data, 'OpenCellID API', locate.opencellid);
test(data, 'CellLocation.com API', locate.celllocation);
