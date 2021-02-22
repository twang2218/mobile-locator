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

[coverage-url]: https://coveralls.io/github/twang2218/mobile-locator?branch=master
[coverage-image]: https://coveralls.io/repos/github/twang2218/mobile-locator/badge.svg?branch=master

Get geolocation from cell tower information.

Currently, the following APIs are implemented:

- `cellocation`: [Cellocation.com API (China)](http://www.cellocation.com/interfac/)
- `google`: [Google Geolocation API](https://developers.google.com/maps/documentation/geolocation/intro)
- `haoservice`: [HaoService.com API (China)](http://www.haoservice.com/docs/1)
- `mozilla`: [Mozilla Geolocation API](https://location.services.mozilla.com/api)
- `mylnikov`: [Mylnikov Geolocation API](https://www.mylnikov.org/archives/1059)
- `unwiredlabs`: [UnwiredLabs Location API](https://unwiredlabs.com/) (same as OpenCellid<sup>*</sup>)
- `yandex`: [Yandex Geolocation API (Russian)](https://tech.yandex.ru/locator/doc/dg/api/geolocation-api_json-docpage/)

<sup>*</sup>OpenCellid is operated by UnwiredLabs and their APIs have been merged into one, meaning that you can use the `unwiredlabs` API with an API key from OpenCellid.

# Library

## api(name, options)

Create the location engine by given name and options.

*Name*  | *Options*
--- | ---
 `cellocation` | `system`_(optional)_: Coordinate system: `wgs84`_(Default)_, `gcj02`, `bd09`.
 `google` | `key`: Google API key
 `haoservice` | `key`: HaoService API key, <br> `system`_(optional)_: Coordinate system: `0`: gcj02; `1`:bd09; `2`:wgs84_(Default)_
 `mozilla` | `key`: Mozilla API key
 `mylnikov` | `data`_(optional)_: `open`: Use open source data.
 `unwiredlabs` | `key`: UnwiredLabs Location API token
 `yandex` | `key`: Yandex API key

Besides the above engine-specific options,  more general options are also available:

- `verbose`: Print more debug information if `verbose` is `true`;
- `timeout`: Set the timeout value in milliseconds. There is no timeout by default.

The returned value is a `locate()` function, which will be described in the next section.

## locate(cellInfo)

`info` is an object that should contain cell information, including `mobileNetworkCode`, `mobileCountryCode`, `locationAreaCode` and `cellId`. Additionally, information about the `accessTechnology` as well as `signalStrength` can be added for a more accurate position estimate, this is however optional.

The function will return a promise, which will return the `location` from given geolocation service.

`location` is an object contains following properties:

*Property*  | *Description*
--- | ---
 `longitude` | Longitude
 `latitude` | Latitude
 `accuracy` | The accuracy range of the given position
 `address`(optional) | For some API, this property contains the human readable address line.

## Example

```javascript
const api = require('mobile-locator');

const locate = api('google', { key: YOUR_GOOGLE_API_KEY });

locate({
  mobileCountryCode: 460,
  mobileNetworkCode: 0,
  locationAreaCode: 4219,
  cellId: 20925,
  accessTechnology: 'gsm', // optional
  signalStrength: -55 // optional
}).then(location => console.log(JSON.stringify(location, null, 2)));
```

The output would be:

```javascript
{
  longitude: 116.46661859999998,
  latitude: 39.991583399999996,
  accuracy: 1098
}
```

# Command-line Interface

Usage

```bash
$ mobile-locator -h

Usage: cli [options]

Locate geolocation information based on Cell base station data


Options:

    -V, --version                  output the version number
    -c, --cell <string>            Cell tower base station information in format "MCC,MNC,LAC,CID". "-c 460,0,4219,20925"
    -e, --engine <string>          Geolocation service engine. {cellocation, google, haoservice, mozilla, mylnikov, unwiredlabs, yandex}. Default: google (default: google)
    -s, --signalStrength <number>  Signal strength [dBm], e.g. "-75".
    -r, --radio <string>           Radio type/access technology. {gsm, cdma, wcdma, lte}. e.g. "lte".
    -a, --arguments <string>       Arguments for geolocation engine. e.g. "key:XXX,oid:123".
    -m, --map <string>             Map service. {google, bing, openstreetmap, google.cn, bing.cn, baidu}. Default: google
    -v, --verbose                  Verbose output.
    -h, --help                     output usage information
Examples:

    $ mobile-locator -a "key:XXX" -c 460,0,4219,20925
    $ mobile-locator -e cellocation -a "system:bd09" -m baidu -c 460,0,4219,20925

```

By default, the Google Geolocation engine will be used.

```bash
$ mobile-locator -a "key:GOOGLE_API_KEY" -c 460,0,4219,20925
{"longitude":116.46679499999998,"latitude":39.9910226,"accuracy":606}
```

With verbose option:

```bash
$ mobile-locator -a "key:AIzaSyAL2sfTLqUv9Rb3ercbtuu__PG2pS_4eDo" -c 460,0,4219,20925 -v
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
$ mobile-locator -e cellocation -a 'system:bd09' -m baidu -v -c 460,0,4219,20925
Geolocation engine: "cellocation"
Cell: {"mcc":"460","mnc":"0","lac":"4219","cid":"20925"}
Location: {"longitude":"116.479653","latitude":"39.997967","accuracy":"100","address":"北京市朝阳区望京街道望京园402号楼;广顺南大街与阜安西路路口东北109米"}
Map url: http://api.map.baidu.com/marker?location=39.997967,116.479653&title=_&content=北京市朝阳区望京街道望京园402号楼;广顺南大街与阜安西路路口东北109米&output=html&autoOpen=true
```
