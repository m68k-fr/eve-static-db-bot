const Discord = require("discord.js");
const http = require('http');
const fs = require("fs");
const imageServer = require("../utils/imageServer");

/*const {
    token, // Your bot's token
    prefix // Your bot's prefix
} = require("../config.sample.json"); // This is your configuration file, see an example on "config.sample.json"

try {
    config = require('../config.sample.json')
} catch (err) {
    auth = {
        token: process.env['TOKEN'],
        admins: (process.env['ADMINS'] || '').split(',')
    }
}*/


// test Express

let imgserver = imageServer.init('../../datas/Renders/');
http.request({method: 'HEAD', host: 'localhost', port: 8000, path: '/'}, (response) => {
    callback(response);
}).on('error', callback).end();

function callback(response) {
    imgserver.close();
    if ( response.statusCode !== 200) {
        return true;
    }
}
