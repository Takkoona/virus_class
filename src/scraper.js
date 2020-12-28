const fs = require('fs');
const path = require('path');
const url = require('url');
const axios = require('axios');
const cheerio = require('cheerio');

const dirpath = path.resolve(__dirname, '..', 'data');

async function getViruNum() {
    const viprURL = 'https://www.viprbrc.org/brc/vipr_allSpecies_search.spg?method=SubmitForm&decorator=vipr';

    console.log("Making request to ViPR...");
    const html = await axios.get(viprURL);

    console.log("Parsing html...");
    const $ = cheerio.load(html.data);
    let numList = {};
    let numMapping = {};
    $('tr.multicheckRow.odd').each((_index, element) => {
        let groupid = $(element).attr('groupid');
        // console.log(groupid);
        let columns = $(element).children();
        let colNum = columns.length;
        if (colNum === 4) {
            numMapping[groupid] = $(columns).eq(0).text();
            numList[numMapping[groupid]] = [];
        }
        numList[numMapping[groupid]].push($(columns).last().text());
    });
    return {
        outfile: 'virusNum.json',
        data: numList
    };
}

async function getViruClass() {
    let classList = {};

    const viralzoneURL = 'https://viralzone.expasy.org/';

    console.log("Making request to viralzone...");
    const html = await axios.get(viralzoneURL);

    console.log("Parsing html...");
    const mainpage = cheerio.load(html.data);
    mainpage('#t0 > table > tbody > tr').next().find('a').each(async (index, element) => {
        let targteURL = url.resolve(
            viralzoneURL,
            mainpage(element).attr('href')
        );

        console.log("Making request to virus class page...");
        const html = await axios.get(targteURL);

        console.log("Parsing virus class page html...");
        const classpage = cheerio.load(html.data);
        let title = classpage('title').text();
        title = title.split(' ~ ')[0];
        console.log(title);
        familyList = [];
        classpage('strong').each((index, element) => {
            n = classpage(element).text();
            if (n.endsWith('dae')) {
                familyList.push(n);
            }
        });
        classList[title] = familyList;
    })
    return {
        outfile: 'virusClass.json',
        data: classList
    }
}

// Call this sychronously because this folder is needed beforehand
if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
}

Promise.all([
    getViruNum(),
    getViruClass()
]).then(values => {
    values.map(res => {
        outfile = res.outfile;
        fs.writeFile(
            path.resolve(dirpath, outfile),
            JSON.stringify(res.data, null, 2),
            (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('File saved');
                }
            }
        );
    })
}).catch(err => {
    console.error(err);
})
