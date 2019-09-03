// 加载依赖库
const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

// 路由控制
const routes = require('./routes/index');
const weather = require('./routes/weather');
const proxy = require('./routes/proxy');

// 项目实例
const app = express();
// 项目支持html
const ejs = require('ejs');

// 视图模板设置 这边设置的是ejs
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// 图标地址
app.use(favicon());
// 日志和输出级别
app.use(logger('dev'));
// 数据解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// cookie
app.use(cookieParser());
// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路由
app.use('/', routes);
app.use('/weather', weather);
app.use('/proxy', proxy);


/// 404错误处理
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 开发环境 500错误处理和错误信息跟踪
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境 500错误处理
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 输出模型app
module.exports = app;
