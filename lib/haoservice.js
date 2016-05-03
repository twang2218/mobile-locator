const request = require('request');
const querystring = require('querystring');
const _ = require('lodash');

const API = 'http://api.haoservice.com/api/getlbs';

class HaoService {
  constructor(options) {
    this.key = options.key;
  }

  locate(cell, callback) {
    //  Construct url
    const qs = querystring.stringify({
      oid: this.oid,
      mcc: cell.mcc,
      mnc: cell.mnc,
      lac: cell.lac,
      cell_id: cell.cid,
      key: this.key,
      output: 'json',
    });
    const url = `${API}?${qs}`;
    console.log(url);

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
          if (body.ErrCode !== '0') {
            //  Callback with error message
            if (_.isFunction(callback)) {
              callback(`Response Error: Error Code: ${body.ErrCode}`, null);
            }
          } else {
            //  Parse retrieved data
            const location = {
              longitude: body.location.longitude,
              latitude: body.location.latitude,
              accuracy: body.location.accuracy,
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
module.exports = HaoService;
