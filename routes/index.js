const express = require('express');
const router = express.Router();
const infoModel = require('../models/info');


/* GET home page. */
router.get('/',async function (req, res) {
    let data = await infoModel.getCityInfo();
    res.render('index', {title: 'Nodejs爬虫', province: data.province, city: data.city});
});

router.get('/city', async function (req, res) {
    // http://127.0.0.1:8888/city
    let data = await infoModel.getCityInfo();
    res.json(data);
});


module.exports = router;
