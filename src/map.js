const querystring = require('querystring');

const services = {
  google: 'https://www.google.com/maps/@:lat,:long,:rangem/data=!3m1!1e3',
  bing: 'https://www.bing.com/maps/?v=2&cp=:lat~:long&style=h&lvl=16',
  'google.cn': 'http://www.google.cn/maps/@:lat,:long,:rangem/data=!3m1!1e3',
  'bing.cn': 'https://www.bing.com/ditu/?v=2&cp=:lat~:long&style=h&lvl=16',
  openstreetmap: 'http://www.openstreetmap.org/#map=16/:lat/:long',
  baidu: 'http://api.map.baidu.com/marker?location=:lat,:long&title=_&content=:addr&output=html&autoOpen=true',
};

const map = (service, location) =>
  services[service]
    .replace(/:lat/g, location.latitude)
    .replace(/:long/g, location.longitude)
    .replace(/:range/g, location.accuracy || 100)
    .replace(/:addr/g, location.address ? querystring.escape(location.address) : '');

module.exports = map;
