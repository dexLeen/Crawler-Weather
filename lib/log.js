const fs = require('fs');
const time = require('china-time');

const path = './logs';
const fileName = `${path}/${time('YYYY-MM-DD')}.log`;

module.exports = {
    recordInfomation: (token, type) => {
        try {
            token = token.replace(/Bearer\s/g, '');
            type = type.toLocaleUpperCase();
            let content = '\n [' + type + '] ' + time('YYYY-MM-DD HH:mm:ss') + '\n';
            content += '' + token;
            if (fs.existsSync(fileName)) {
                fs.appendFileSync(fileName, content);
            } else {
                if (fs.existsSync(path)) {
                    if (fs.existsSync(fileName)) {
                        fs.appendFileSync(fileName, content);
                    } else {
                        fs.writeFileSync(fileName, content);
                    }
                } else {
                    fs.mkdirSync(path);
                    fs.writeFileSync(fileName, content);
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
};

