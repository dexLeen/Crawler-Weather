const express = require('express');
const router = express.Router();
const infoModel = require('../models/info');

router.get('/getWeather',async function (req, res, next) {
    // http://127.0.0.1:8888/weather/getWeather?city=/luoyang/&type=30
    let city = req.query.city || '/xuhui/';
    let type = req.query.type || 30;
    let data = await infoModel.getWeather(city,type);
    res.json(data);
});

module.exports = router;
