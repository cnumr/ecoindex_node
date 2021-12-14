# ecoindex

This Node.js module calculates a webpage's [ecoindex](http://www.ecoindex.fr)

## Installation
```bash
$ npm install https://github.com/cnumr/ecoindex_node/tarball/master
```

## Usage
```javascript
const ecoindex = require('ecoindex');

/**
 * dom = number of HTML elements in DOM
 * req = number of external requests (images, css, frames, etc.)
 * size = total size of the page (including external requests) in ko
 * returns an object containing the ecoindex score (number between 0 and 100, higher is better), the grade (letter between A and G), the greenhouse gas emission and the water consumption
 **/
var index = ecoindex.getEcoindex(dom, req, size); // { score: 89, grade: 'A', ghg: 1.22, water: 1.83 }
```

Full example with [puppeteer](https://github.com/puppeteer/puppeteer) :
```javascript
const zlib = require('zlib');
const puppeteer = require('puppeteer');
const ecoindex = require('ecoindex');

(async () => {
    var url = 'https://example.com';
    var browser = await puppeteer.launch();
    var page = await browser.newPage();

    // get number of external requests
    var req = 0;
    await page.on('request', request => {
        if (!request.url().startsWith('data:')) {
            req++;
        }
    });

    // get total uncompressed size
    var size = 0;
    await page.on('response', response => {
        if (response.ok()) {
            switch (response.headers()['content-encoding']) {
                case 'br':
                    response.buffer().then(buffer => {
                        zlib.brotliCompress(buffer, function (_, result) {
                            size += result.length;
                        });
                    });
                    break;
                case 'gzip':
                    response.buffer().then(buffer => {
                        zlib.gzip(buffer, function (_, result) {
                            size += result.length;
                        });
                    });
                    break;
                case 'deflate':
                    response.buffer().then(buffer => {
                        zlib.deflate(buffer, function (_, result) {
                            size += result.length;
                        });
                    });
                    break;
                default:
                    response.buffer().then(buffer => {
                        size += buffer.length;
                    });
                    break;
            }
        }
    });

    await page.goto(url);

    // get number of DOM elements
    var dom = await page.evaluate(() => document.querySelectorAll('*').length);

    await browser.close();

    // calculate ecoindex
    var index = ecoindex.calculate(dom, req, Math.round(size / 1024));

    process.stdout.write(index.toString());
})();
```
