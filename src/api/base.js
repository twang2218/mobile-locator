const request = require('request');
const isFunction = require('lodash/isFunction');

/* eslint-disable class-methods-use-this */
class Base {
  constructor(options) {
    if (options) {
      if (options.verbose) {
        request.debug = true;
      }
      if (options.timeout) {
        this.timeout = options.timeout;
      }
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

  doCallbank(callback, error, value) {
    if (isFunction(callback)) {
      callback(error, value);
    }
  }

  locate(cell, callback) {
    //  Send request
    const options = this.getRequestSettings(cell);
    options.timeout = this.timeout;

    request(options, (error, response, body) => {
      if (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
          if (error.connect === true) {
            callback('Request connection timeout.', null);
          } else {
            callback('Request timeout.', null);
          }
        } else {
          //  Callback with error
          this.doCallbank(callback, `Request Error: ${JSON.stringify(error)}`, null);
        }
      } else {
        const b = this.preprocessBody(body);
        if (response.statusCode === 200) {
          if (!this.validate(b)) {
            //  Callback with error message
            this.doCallbank(callback, `Response Error: ${JSON.stringify(this.parseError(b))}`, null);
          } else {
            //  Callback with location info
            this.doCallbank(callback, null, this.parseLocation(b));
          }
        } else {
          //  Callback with HTTP Status Error Code
          this.doCallbank(callback, `Response Error: ${response.statusCode}: ${response.statusMessage} (${JSON.stringify(this.parseError(b))})`, null);
        }
      }
    });
  }
}

module.exports = Base;
