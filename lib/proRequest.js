'use strict';
const util = require('util');
const request = require('request');
const DEFAULT_TIMEOUT = 2000;
const HTTP_METHOD_GET = 'GET';

module.exports = {
    doRequest: requestHandler,
};

/**
 * Http request Handler
 * @param {String} url
 * @param {Object | String} options
 * @param {String} method
 * @param {Object | Array} requestBody
 * @return {Object}
 */
function requestHandler(url, options, method = HTTP_METHOD_GET, requestBody) {
    let respObj;
    let params = {
        url: url,
        method: method,
        json: true,
        headers: {},
    };
    if (typeof options === 'object') {
        params = Object.assign(params, options);
    }

    params.headers['Content-Type'] = 'application/json';

    if (!params.hasOwnProperty('timeout')) {
        params.timeout = DEFAULT_TIMEOUT;
    }
    if (requestBody) {
        params.body = requestBody;
    }
    return util.promisify(request)(params).then((resp) => {
        respObj = resp;
        unexpectedCheck(resp);
        return resp.body;
    }).catch((err) => {
        if (respObj && respObj.statusCode) {
            throw new Error(
                JSON.stringify({
                    url: url,
                    method: method,
                    statusCode: respObj.statusCode,
                    body: respObj.body,
                })
            );
        } else {
            throw new Error(
                JSON.stringify({
                    url: url,
                    body: err.message,
                })
            );
        }
    });
}

/**
 * Unexpected response checking
 * @param {Object} response
 */
function unexpectedCheck(response) {
    if (response.statusCode != 200) {
        throw new Error('Status error');
    }
}
