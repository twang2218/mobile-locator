const request = require('request');
const _ = require('lodash');

const API = 'https://location.services.mozilla.com/v1/geolocate?key=$KEY';

class MozillaGeolocation {
  constructor(key) {
    this.url = API.replace('$KEY', key);
  }

  locate(cell, callback) {
    request({
      method: 'POST',
      uri: this.url,
      json: {
        considerIp: false,
        cellTowers: [{
          cellId: cell.cid,
          locationAreaCode: cell.lac,
          mobileCountryCode: cell.mcc,
          mobileNetworkCode: cell.mnc,
        }],
      },
    }, (error, response, body) => {
      if (error) {
        //  callback with error
        if (_.isFunction(callback)) {
          callback(`Request Error: ${error}`, null);
        }
      } else {
        if (response.statusCode === 200) {
          //  Parse retrieved data
          const location = {
            longitiude: body.location.lng,
            latitude: body.location.lat,
            accuracy: body.accuracy,
          };
          //  Callback with location info
          if (_.isFunction(callback)) {
            callback(null, location);
          }
        } else {
          //  Callback with HTTP Status Error Code
          if (_.isFunction(callback)) {
            callback(
              `Request Error: ${response.statusCode}: ${response.statusMessage} (${body.error.errors[0].reason})`,
              null);
          }
        }
      }
    });
  }
}

//  Exports
module.exports = MozillaGeolocation;
