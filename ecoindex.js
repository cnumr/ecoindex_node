const zlib = require('zlib');
const input = require('commander');
const puppeteer = require('puppeteer');
const calculator = require('./calculator.js');

(async () => {
    input
        .arguments('<arg>')
        .action(arg => url = arg)
        .option('-f, --format <format>', 'Output format (ex: json).')
        .option('-c, --collector <collector>', 'Webhook URL (the result will be send as JSON payload).')
        .parse(process.argv);

    try {
        new URL(url);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }

    var browser = await puppeteer.launch();
    var page = await browser.newPage();

    var req = 0;
    await page.on('request', request => {
        if (!request.url().startsWith('data:')) {
            req++;
        }
    });

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

    var dom = await page.evaluate(() => document.querySelectorAll('*').length);

    await browser.close();

    var index = calculator.calculate(dom, req, Math.round(size / 1024));

    console.log(index);
})();
