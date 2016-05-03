const request = require('request');
const querystring = require('querystring');
const _ = require('lodash');

const API = 'http://api.cellocation.com/cell/';

class CellLocation {
  locate(cell, callback) {
    //  Construct url
    const qs = querystring.stringify({
      mcc: cell.mcc,
      mnc: cell.mnc,
      lac: cell.lac,
      ci: cell.cid,
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
          if (body.errcode !== 0) {
            //  Callback with error message
            if (_.isFunction(callback)) {
              callback(`Response Error: Error Code: ${body.error}`, null);
            }
          } else {
            //  Parse retrieved data
            const location = {
              longitude: body.lon,
              latitude: body.lat,
              accuracy: body.radius,
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
module.exports = CellLocation;
