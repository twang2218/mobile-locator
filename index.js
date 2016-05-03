// `config.json`:
// {
//     "google_api_key": "<YOUR_GOOGLE_API_KEY>"
// }
const config = require('./config');

const Geolocation = require('./lib');
const locate = new Geolocation({
  google_api_key: config.google_api_key,
});

const data = {
  mcc: 460,
  mnc: 1,
  lac: 4219,
  cid: 20925,
};

locate.google.locate(data, (error, location) => {
  if (error) {
    console.error(error);
  } else {
    console.log(location);
    console.log(
      `https://www.google.com/maps/@${location.latitude},${location.longitiude},1000m/data=!3m1!1e3`
    );
    console.log(`http://www.google.cn/maps/@${location.latitude},${location.longitiude},1000m/data=!3m1!1e3`);
    console.log(`https://www.bing.com/maps/?v=2&cp=${location.latitude}~${location.longitiude}&style=h&lvl=12`);
  }
});
