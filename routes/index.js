const express = require('express');
const router = express.Router();
const http = require('../lib/httpRequest');
const cheerio = require('cheerio');


let baseUrl = "http://www.tianqi.com";

/* GET home page. */
router.get('/', function (req, res) {
    let url = `${baseUrl}/chinacity.html`;
    let provinceList = [];
    let cityList = [];
    return http.processRequest('GET', url).then((data) => {
        let $ = cheerio.load(data, {decodeEntities: false});
        $(".wrapbox .citybox>h2").each(function (key, val) {
            let content = $(this).html();
            let province = content.replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '');
            let url = /<a.+?href=\"(.+?)\".*>/.exec(content)[1];
            let object = {
                Id: key + 1,
                'province': province,
                url: url
            };
            provinceList.push(object);
        });

        $(".wrapbox .citybox>span").each(function (key, val) {
            var content = $(this).html();
            if (content.indexOf('h3') > -1) {
                // 过滤h3
                content = content.replace(/<\/?h3>/g, '');
            }
            content = content.split('</a>');
            for (let i = 0; i < content.length - 1; i++) {
                var object = {Id: key + 1};
                object.city = />(.*)/.exec(content[i])[1];
                object.url = /href=\"(.+?)\">/.exec(content[i])[1];
                cityList.push(object);
            }
        });
        res.render('index', {title: 'Nodejs爬虫', province: provinceList, city: cityList});
    });
});


module.exports = router;
