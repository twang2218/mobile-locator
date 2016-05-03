const request = require('request');
const _ = require('lodash');

const API = 'http://api.lbs.yandex.net/geolocation';

class Yandex {
  constructor(options) {
    this.key = options.key;
  }

  locate(cell, callback) {
    //  Send request
    request.post({
      uri: API,
      body: `json=${JSON.stringify({
        common: {
          version: '1.0',
          api_key: this.key,
        },
        gsm_cells: [{
          countrycode: cell.mcc,
          operatorid: cell.mnc,
          lac: cell.lac,
          cellid: cell.cid,
        }],
      })}`,
    }, (error, response, body) => {
      if (error) {
        //  Callback with error
        if (_.isFunction(callback)) {
          callback(`Request Error: ${error}`, null);
        }
      } else {
        const json = JSON.parse(body);
        if (response.statusCode === 200) {
          if (_.has(json, 'error')) {
            //  Callback with error message
            if (_.isFunction(callback)) {
              callback(`Response Error: Error Code: ${json.error}`, null);
            }
          } else if (json.position.type === 'ip') {
            //  The location is based on current IP, rather than cell
            if (_.isFunction(callback)) {
              callback('Response Error: Cell not found.', null);
            }
          } else {
            //  Parse retrieved data
            const location = {
              longitude: json.position.longitude,
              latitude: json.position.latitude,
              accuracy: json.position.precision,
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
            const message = _.has(json, 'error') ? `[${json.error.code}] ${json.error.text}` : body;
            callback(`Response Error: ${status} (${message})`, null);
          }
        }
      }
    });
  }
}

//  Exports
module.exports = Yandex;
