const request = require('request-promise');
const debug = require('debug')('mobile-locator');

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

  locate(cell) {
    //  Send request
    const options = Object.assign({}, this.getRequestSettings(cell), {
      resolveWithFullResponse: true,
      timeout: this.timeout,
    });

    return request(options)
      .then((response) => {
        const b = this.preprocessBody(response.body);
        if (response.statusCode === 200) {
          if (!this.validate(b)) {
            //  Callback with error message
            throw new Error(this.parseError(b));
          } else {
            //  Callback with location info
            return this.parseLocation(b);
          }
        } else {
          //  Callback with HTTP Status Error Code
          throw new Error(`${response.statusCode}: ${response.statusMessage} (${this.parseError(b)})`);
        }
      })
      .catch((error) => {
        debug(error);
        if (
          error.message &&
          (error.message.indexOf('ETIMEDOUT') >= 0 || error.message.indexOf('ESOCKETTIMEDOUT') >= 0)
        ) {
          if (error.connect === true) {
            throw new Error('Request connection timeout.');
          } else {
            throw new Error('Request timeout.');
          }
        } else {
          //  Callback with error
          throw error;
        }
      });
  }
}

module.exports = Base;
