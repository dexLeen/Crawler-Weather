const express = require('express');
const router = express.Router();
const http = require('../lib/httpRequest');
const cheerio = require('cheerio');


/* GET home page. */
router.get('/', function (req, res) {
    let url = 'http://www.tianqi.com/chinacity.html';
    let provinceList = [];
    let cityList = [];
    http.processRequest('GET', url).then((data) => {
        let $ = cheerio.load(data, {decodeEntities: false});
        $(".wrapbox .citybox>h2").each(function (key, val) {
            let content = $(this).html();
            let province = content.replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '');
            let url = /<a.+?href=\"(.+?)\".*>/.exec(content)[1];
            let object = {
                Id: key,
                'province': province,
                url: url
            };
            provinceList.push(object);
        });

        $(".wrapbox .citybox>span").each(function () {
            $(this).html();
        });
    });
    res.render('index', {title: 'Nodejs爬虫'});
});


router.get('/getWeather', function (req, res, next) {
    let data = [7, 10, 15, 30];
    let city = req.param('city') || 'luoyang';
    let time = data.includes(req.param('time')) ? req.param('time') : 30;
    let url = `https://www.tianqi.com/${city}/${time}`;

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
            let temperature = min + '~' + max + '℃';

            let obj = {
                'type': type,
                'temperature': temperature,
                'time': /<b>([^<]*)<\/b>/.exec(time)[1],
                'wind': wind,
            };
            weathers.push(obj);
        });
        res.json(weathers);
    });
});


module.exports = router;
