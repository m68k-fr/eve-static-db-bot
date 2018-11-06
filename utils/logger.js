// winston logger

const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'datas/logs';

// Create the log directory if it does not exist

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = winston.createLogger({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new (require('winston-daily-rotate-file'))({
            dirname: `${__dirname}/../${logDir}/`,
            filename: `bot.%DATE%.log`,
            timestamp: tsFormat,
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: env === 'development' ? 'verbose' : 'info'
        })
    ],
    exitOnError: false
});

exports.logger = logger;
