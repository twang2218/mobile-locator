const request = require('request');
const querystring = require('querystring');
const _ = require('lodash');

const API = 'http://opencellid.org/cell/get';

class OpenCellID {
  constructor(options) {
    this.key = options.key;
  }

  locate(cell, callback) {
    //  Construct url
    const qs = querystring.stringify({
      key: this.key,
      mcc: cell.mcc,
      mnc: cell.mnc,
      lac: cell.lac,
      cellid: cell.cid,
      format: 'json',
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
          if (_.has(body, 'error')) {
            //  Callback with error message
            if (_.isFunction(callback)) {
              callback(`Response Error: ${body.error}`, null);
            }
          } else {
            //  Parse retrieved data
            const location = {
              longitude: body.lon,
              latitude: body.lat,
              accuracy: body.range,
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
            const message = _.has(body, 'error') ? body.error : body;
            callback(`Response Error: ${status} (${message})`, null);
          }
        }
      }
    });
  }
}

//  Exports
module.exports = OpenCellID;
