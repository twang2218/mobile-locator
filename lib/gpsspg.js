const request = require('request');
const querystring = require('querystring');
const _ = require('lodash');

const API = 'http://api.gpsspg.com/bs/';

class GPSspg {
  constructor(options) {
    this.oid = options.oid;
    this.key = options.key;
  }

  locate(cell, callback) {
    //  Construct url
    const qs = querystring.stringify({
      oid: this.oid,
      type: '',
      mcc: cell.mcc,
      mnc: cell.mnc,
      a: cell.lac,
      b: cell.cid,
      //  0:WGS84; 1:Google Maps; 2:Baidu Maps; 3:QQ Maps; 4:MapBar
      to: 0,
      key: this.key,
      output: 'json',
    });
    const url = `${API}?${qs}`;

    //  Send request
    request({
      uri: url,
      json: true,
    }, (error, response, body) => {
      if (error) {
        //  Callback with error
        if (_.isFunction(callback)) {
          callback(`Request Error: ${error}`, null);
        }
      } else {
        if (response.statusCode === 200) {
          if (body.status !== '200') {
            //  Callback with error message
            if (_.isFunction(callback)) {
              callback(`Response Error: Error Code: ${body.status}`, null);
            }
          } else {
            //  Parse retrieved data
            const location = {
              longitude: body.result.lng,
              latitude: body.result.lat,
              accuracy: body.result.radius,
            };
            //  Callback with location info
            if (_.isFunction(callback)) {
              callback(null, location);
            }
          }
        } else {
          //  Callback with HTTP Status Error Code
          if (_.isFunction(callback)) {
            const status = `${response.statusCode}: ${response.statusMessage}`;
            callback(`Response Error: ${status} (${body})`, null);
          }
        }
      }
    });
  }
}

//  Exports
module.exports = GPSspg;
