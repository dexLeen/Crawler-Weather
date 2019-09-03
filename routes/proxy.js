const express = require('express');
const router = express.Router();
const http = require('../lib/httpRequest');
const cheerio = require('cheerio');

router.get('/', function (req, res, next) {
    res.render('proxy', {title: 'Get Ips'});
    return next();
})

router.get('/ips', function (req, res, next) {
    let type = req.query.type;
    // let pageSize = 15;
    let pageNum = 1;
    let baseUrl = `https://www.kuaidaili.com/free/inha/${pageNum}/`;
    if (type === '89ip') {
        baseUrl = `http://www.89ip.cn/index_${pageNum}.html`;
    }
    let result = [];

    return http.processRequest('GET', baseUrl).then((data) => {
        let $ = cheerio.load(data, {decodeEntities: false});
        if (type === '89ip') {
            let body = $(".layui-form .layui-table tbody");
            let reg = /<td[^>]*>(?:&nbsp;)?(.*)<\/td>/g;
            $(".layui-form .layui-table tbody tr").each(function (key, value) {
                let content = $(value).html().toString();
                console.log(body);
                let body = reg.exec(content);

            })
        } else {

        }
        res.json(200, result);
    });
});

module.exports = router;
