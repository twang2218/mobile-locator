/* eslint-disable no-undef */

const Map = require('../src/mapservice');

describe('map.js', () => {
  const location = {
    latitude: 39.9910225,
    longitude: 116.4667949,
    accuracy: 100,
    address: 'the address',
  };
  const map = new Map();
  [
    { service: 'google', url: 'https://www.google.com/maps/@39.9910225,116.4667949,100m/data=!3m1!1e3' },
    { service: 'bing', url: 'https://www.bing.com/maps/?v=2&cp=39.9910225~116.4667949&style=h&lvl=16' },
    { service: 'google.cn', url: 'http://www.google.cn/maps/@39.9910225,116.4667949,100m/data=!3m1!1e3' },
    { service: 'bing.cn', url: 'https://www.bing.com/ditu/?v=2&cp=39.9910225~116.4667949&style=h&lvl=16' },
    { service: 'openstreetmap', url: 'http://www.openstreetmap.org/#map=16/39.9910225/116.4667949' },
    { service: 'baidu', url: 'http://api.map.baidu.com/marker?location=39.9910225,116.4667949&title=_&content=the%20address&output=html&autoOpen=true' },
  ].forEach(({ service, url }) => {
    it(`should format coordinate to '${service}' map service URL`, () => {
      expect(map.format(service, location)).toEqual(url);
    });
  });
});
