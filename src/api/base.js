const request = require('request-promise');
const debug = require('debug')('mobile-locator');

/* eslint-disable class-methods-use-this */
class Base {
  constructor(options) {
    if (!options) return;
    if (options.verbose) request.debug = true;
    if (options.timeout) this.timeout = options.timeout;
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

  async locate(cellInfo) {
    const options = {
      ...this.getRequestSettings(cellInfo),
      resolveWithFullResponse: true,
      timeout: this.timeout,
    };

    try {
      const { body, statusCode } = await request(options);

      const isStatusCodeOk = statusCode === 200;
      if (!isStatusCodeOk) {
        throw new Error(`${response.statusCode}: ${response.statusMessage} (${this.parseError(b)})`);
      }

      const preProcessedBody = this.preprocessBody(body);
      
      const isPreProcessedBodyValid = this.validate(preProcessedBody);
      if (!isPreProcessedBodyValid) throw new Error(this.parseError(b));

      return this.parseLocation(preProcessedBody);
    } catch (error) {
      debug(error);

      const isErrorMessageTimeOut = error?.message.indexOf('ETIMEDOUT') >= 0
      const isErrorMessageSocketTimeOut = error?.message.indexOf('ESOCKETTIMEDOUT') >= 0
      const isErrorMessageTimeoutRelated = isErrorMessageTimeOut || isErrorMessageSocketTimeOut

      const isConnectionEstablished = error?.connect
      const isRequestConnectionTimeoutError = isErrorMessageTimeoutRelated && isConnectionEstablished

      if (isRequestConnectionTimeoutError) throw new Error('Request connection timeout.');
      if (isErrorMessageTimeoutRelated) throw new Error('Request timeout.');
      throw error;
    }
  }
}

module.exports = Base;
