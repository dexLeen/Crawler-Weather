const express = require('express');
const router = express.Router();
const http = require('../lib/httpRequest');
const cheerio = require('cheerio');

let baseUrl = "http://www.tianqi.com";

router.get('/getWeather', function (req, res, next) {
    let city = req.query.city;
    let type = req.query.type || 30;
    let url = `${baseUrl}${city}${type}`;
    let weathers = [];

    return http.processRequest('GET', url).then((data) => {
        let $ = cheerio.load(data, {decodeEntities: false});
        $(".weatherbox3 .box_day>.table_day").each(function () {
            let time = $(this).find('h3').html();
            let wind = $(this).find('ul li').last().html();
            let content = $(this).find('ul .temp').html();

            let type = content.split(' ').shift();

            let list = content.split(' ').pop().split('~');
            let min = list.shift();
            let max = /<b>([^<]*)<\/b>/.exec(list.pop())[1];
            //let temperature = min + '~' + max + '℃';

            let obj = {
                'type': type,
                //'temperature': temperature,
                'max': max,
                'min': min,
                'time': /<b>([^<]*)<\/b>/.exec(time)[1],
                'wind': wind,
            };
            weathers.push(obj);
        });
        res.json(weathers);
    });
});

module.exports = router;
