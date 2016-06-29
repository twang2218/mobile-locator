/* eslint strict:0 */
'use strict';

const request = require('request');
// request.debug = true;
const _ = require('lodash');

class Base {
  constructor(options) {
    if (options && options.verbose) {
      request.debug = true;
    }
  }
  getRequestSettings() {
    return {};
  }

  preprocessBody(body) {
    return body;
  }

  validate() {
    return true;
  }

  parseLocation() {
    return {};
  }

  parseError(body) {
    return body;
  }

  locate(cell, callback) {
    //  Send request
    request(this.getRequestSettings(cell), (error, response, body) => {
      if (error) {
        //  Callback with error
        if (_.isFunction(callback)) {
          callback(`Request Error: ${JSON.stringify(error)}`, null);
        }
      } else {
        const b = this.preprocessBody(body);
        if (response.statusCode === 200) {
          if (!this.validate(b)) {
            //  Callback with error message
            if (_.isFunction(callback)) {
              callback(`Response Error: ${JSON.stringify(this.parseError(b))}`, null);
            }
          } else {
            //  Callback with location info
            if (_.isFunction(callback)) {
              callback(null, this.parseLocation(b));
            }
          }
        } else {
          //  Callback with HTTP Status Error Code
          if (_.isFunction(callback)) {
            const status = `${response.statusCode}: ${response.statusMessage}`;
            callback(`Response Error: ${status} (${JSON.stringify(this.parseError(b))})`, null);
          }
        }
      }
    });
  }
}

//  Exports
module.exports = Base;
