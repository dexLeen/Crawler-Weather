const request = require('request');

module.exports = {
    processRequest: function (method, url, body) {
        return new Promise(function (resolve, reject) {
            request(
                {
                    method: method,
                    url: url,
                    body: body,
                    headers: {"Content-Type": "application/json"},
                    json: true,
                    timeout: 10000
                }, function (err, response, body) {
                    if (err) {
                        return reject(new Error('url:' + url + ' method:' + method + ' error: ' + err.message));
                    }
                    if (response.statusCode != 200) {
                        return reject(new Error('Request failed, url:' + url + ' method:' + method + ' statusCode:' + response.statusCode + ' body:' + JSON.stringify(body)));
                    }
                    return resolve(body);
                });
        });
    },
};
