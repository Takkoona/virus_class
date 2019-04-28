const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');


let dirpath = './Data/'

if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
}

let viprURL = 'https://www.viprbrc.org/brc/vipr_allSpecies_search.spg?method=SubmitForm&decorator=vipr';

let numList = {};
let numMapping = {};

request(viprURL, (err, res, html) => {
    if (err) {
        throw err;
    }
    if (res.statusCode == 200) {
        let $ = cheerio.load(html);
        $('tr.multicheckRow.odd').each((index, element) => {
            let groupid = $(element).attr('groupid')
            // console.log(groupid);
            let columns = $(element).children()
            let colNum = columns.length;
            if (colNum === 4) {
                numMapping[groupid] = $(columns).eq(0).text();
                numList[numMapping[groupid]] = [];
            }
            numList[numMapping[groupid]].push($(columns).last().text());
            fs.writeFileSync(
                path.resolve(dirpath, 'virusNum.json'),
                JSON.stringify(numList, null, 2),
                (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log('File saved');
                    }
                }
            )
        })
    }
});
