# Mobile Locator

Get geolocation from cell tower information.

Currently, the following APIs are implemented:

 - `google`: [Google Geolocation API](https://developers.google.com/maps/documentation/geolocation/intro)
 - `mozilla`: [Mozilla Geolocation API](https://location.services.mozilla.com/api)
 - `opencellid`: [OpenCellID API](http://opencellid.org/)
 - `yandex`: [Yandex Geolocation API (Russian)](https://tech.yandex.ru/locator/doc/dg/api/geolocation-api_json-docpage/)
 - `cellocation`: [Cellocation.com API (China)](http://www.cellocation.com/interfac/)
 - `gpsspg`: [GPSspg.com API (China)](http://www.gpsspg.com/api/bs/)
 - `haoservice`: [HaoService.com API (China)](http://www.haoservice.com/docs/1)

# API

## _mobileLocator_.createEngine(name, options)

Create the location engine by given name and options.

*Name*  | *Options*  
--- | ---
 `google` | `key`: Google API key
 `mozilla` | `key`: Mozilla API key
 `opencellid` | `key`: OpenCellID API key
 `yandex` | `key`: Yandex API key
 `cellocation` | `system`(optional): Coordinate system: `wgs84`, `gcj02`, `bd09`.
 `gpsspg` | `key`: GPSspg API key, `oid`: GPSspg OID
 `haoservice` | `key`: HaoService API key

## _engine_.locate(info, callback)

`info` should contain cell information, including `mnc`, `mcc`, `lac` and `cid`.

The `callback` is a function with 2 arguments: `error` and `location`. `error` should be `null` if everything is working, other wise the error message will be in the `error` argument.

`location` is an object contains following properties:

*Property*  | *Description*  
--- | ---
 `longitude` | Longitude
 `latitude` | Latitude
 `accuracy` | The accuracy range of the given position
 `address`(optional) | For some API, this property contains the human readable address line.

# Usage

```javascript
const ml = require('mobile-locator');

const engine = ml.createEngine('google', {
  key: YOUR_GOOGLE_API_KEY,
});
engine.locate({
  mcc: 460,
  mnc: 0,
  lac: 4219,
  cid: 20925,
}, (error, location) => {
  if (error) {
    console.error(error);
  }
  console.log(location);
});

```

The output would be:

```javascript
{ longitude: 116.46679499999998,
  latitude: 39.9910226,
  accuracy: 606 }
```
