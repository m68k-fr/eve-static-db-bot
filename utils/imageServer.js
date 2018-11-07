const express = require("express");
var fs = require('fs');
const sharp = require('sharp');

exports.init = function () {


    const server = express();

    server.get('/', (req, res) => {
        // Extract the query-parameter
        const widthString = req.query.width;
        const heightString = req.query.height;
        const imageIdx = req.query.imageidx;

        // Parse to integer if possible
        let width, height;
        if (widthString) {
            width = parseInt(widthString);
        }
        if (heightString) {
            height = parseInt(heightString);
        }

        if (!imageIdx) {
            res.send("Image not found");
            return;
        }

        const imageFile = __dirname + '/../datas/Renders/' + imageIdx + '.png';
        if (!fs.existsSync(imageFile)) {
            res.send("Image not found");
            return;
        }

        // Get the resized image
        res.type('image/png');
        resize(imageFile, 'png', width, height).pipe(res);
    });

    server.listen(8000, () => {
        console.log('Express Server started!');
    });

};

function resize(path, format, width, height) {
    const readStream = fs.createReadStream(path);
    let transform = sharp();

    if (format) {
        transform = transform.toFormat(format);
    }

    if (width || height) {
        transform = transform
            .resize(width,height);
            /*.extend({
                top: 0,
                bottom: 0,
                left: 61,
                right: 72,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            });*/
    }

    return readStream.pipe(transform);
}
