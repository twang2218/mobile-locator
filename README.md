# Mobile Locator

[![NPM version][npm-version-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][dependency-image]][dependency-url]
[![Coverage Status][coverage-image]][coverage-url]
[![NPM][npm-classy-badge-image]][npm-classy-badge-url]

[license-image]: http://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat
[license-url]: LICENSE.txt

[npm-url]: https://npmjs.org/package/mobile-locator
[npm-version-image]: http://img.shields.io/npm/v/mobile-locator.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/mobile-locator.svg?style=flat
[npm-classy-badge-image]: https://nodei.co/npm/mobile-locator.png?downloads=true&downloadRank=true&stars=true
[npm-classy-badge-url]: https://nodei.co/npm/mobile-locator/

[travis-url]: http://travis-ci.org/twang2218/mobile-locator
[travis-image]: http://img.shields.io/travis/twang2218/mobile-locator.svg?style=flat

[dependency-url]: https://gemnasium.com/twang2218/mobile-locator
[dependency-image]: http://img.shields.io/gemnasium/twang2218/mobile-locator.svg

[coverage-url]: https://coveralls.io/r/twang2218/mobile-locator
[coverage-image]: http://img.shields.io/coveralls/twang2218/mobile-locator.svg


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
 `cellocation` | `system`_(optional)_: Coordinate system: `wgs84`_(Default)_, `gcj02`, `bd09`.
 `gpsspg` | `key`: GPSspg API key, <br> `oid`: GPSspg OID,<br> `system`_(optional)_: Coordinate system: `0`:wgs84_(Default)_; `1`:gcj02; `2`:bd09; `3`:QQ Maps; `4`:MapBar
 `haoservice` | `key`: HaoService API key, <br> `system`_(optional)_: Coordinate system: `0`: gcj02; `1`:bd09; `2`:wgs84_(Default)_

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

## Command-line Interface

Usage

```bash
➜  ~ mobile-locator -h

Usage: mobile-locator [options]

Locate geolocation information based on Cell base station data

Options:

  -h, --help                   output usage information
  -V, --version                output the version number
  -c, --cell <cell>            Cell tower base station information in format "MCC,MNC,LAC,CID". "-c 460,0,4219,20925"
  -e, --engine <engine>        Geolocation service engine. {google, mozilla, opencellid, yandex, cellocation, gpsspg, haoservice}. Default: google
  -a, --arguments <arguments>  Arguments for geolocation engine. e.g. "key:XXX,oid:123".
  -m, --map <map>              Map service. {google, bing, openstreetmap, google.cn, bing.cn, baidu}.
  -v, --verbose                Verbose output.

Examples:

  $ mobile-locator -a "key:XXX" -c 460,0,4219,20925
  $ mobile-locator -e cellocation -a "system:bd09" -m baidu -c 460,0,4219,20925

```

By default, the Google Geolocation engine will be used.

```bash
➜  ~ mobile-locator -a "key:GOOGLE_API_KEY" -c 460,0,4219,20925
{"longitude":116.46679499999998,"latitude":39.9910226,"accuracy":606}
```

With verbose option:

```bash
➜  ~ mobile-locator -a "key:AIzaSyAL2sfTLqUv9Rb3ercbtuu__PG2pS_4eDo" -c 460,0,4219,20925 -v
Geolocation engine: "google"
Cell: {"mcc":"460","mnc":"0","lac":"4219","cid":"20925"}
Location: {"longitude":116.46679499999998,"latitude":39.9910226,"accuracy":606}
```

More complex example:

 - Use `cellocation` engine;
 - Choose `bd09` coordinate system;
 - Show Baidu map url for given coordinate;
 - Verbose output.

```bash
➜  ~ mobile-locator -e cellocation -a 'system:bd09' -m baidu -v -c 460,0,4219,20925
Geolocation engine: "cellocation"
Cell: {"mcc":"460","mnc":"0","lac":"4219","cid":"20925"}
Location: {"longitude":"116.479653","latitude":"39.997967","accuracy":"100","address":"北京市朝阳区望京街道望京园402号楼;广顺南大街与阜安西路路口东北109米"}
Map url: http://api.map.baidu.com/marker?location=39.997967,116.479653&title=_&content=北京市朝阳区望京街道望京园402号楼;广顺南大街与阜安西路路口东北109米&output=html&autoOpen=true
```

## Use the library

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
