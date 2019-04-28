const fs = require('fs');
const url = require('url');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');


let dirpath = './Data/'

if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
}

let viralzoneURL = 'https://viralzone.expasy.org/'

classList = {};

request(viralzoneURL, (err, res, html) => {
    if (err) {
        throw err;
    }
    if (res.statusCode == 200) {
        let $ = cheerio.load(html);
        $('#t0 > table > tbody > tr').next().find('a').each((index, element) => {
            let targteURL = url.resolve(viralzoneURL, $(element).attr('href'));
            request(targteURL, (err, res, html) => {
                if (err) {
                    throw err;
                }
                if (res.statusCode == 200) {
                    $ = cheerio.load(html);
                    let title = $('title').text();
                    title = title.split(' ~ ')[0];
                    console.log(title);
                    familyList = [];
                    $('strong').each((index, element) => {
                        n = $(element).text();
                        if (n.endsWith('dae')) {
                            familyList.push(n);
                        }
                    });
                    classList[title] = familyList;
                    fs.writeFileSync(
                        path.resolve(dirpath, 'virusClass.json'),
                        JSON.stringify(classList, null, 2),
                        (err) => {
                            if (err) {
                                throw err;
                            } else {
                                console.log('File saved');
                            }
                        }
                    )
                }
            })
        })
    }
})
