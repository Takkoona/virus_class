const fs = require('fs');
const path = require('path');
const url = require('url');
const axios = require('axios');
const cheerio = require('cheerio');

async function getVirusNum() {
    const viprURL = 'https://www.viprbrc.org/brc/vipr_allSpecies_search.spg?method=SubmitForm&decorator=vipr';

    console.log("Making request to ViPR...");
    const html = await axios.get(viprURL);

    console.log("Parsing html...");
    const $ = cheerio.load(html.data);
    let numList = [];
    let numMapping = {};
    $('tr.multicheckRow.odd').each((_index, element) => {
        let groupid = $(element).attr('groupid');
        // console.log(groupid);
        let columns = $(element).children();
        if (columns.length === 4) {
            numMapping[groupid] = $(columns).eq(0).text();
            numList[numMapping[groupid]] = [];
        }
        let virusName = $(columns).last().children('a').text();
        let numInfo = $(columns).last().children().remove().end().text();
        numInfo = numInfo.replace(/[()]/g, '').split(' - ');
        numList.push({
            virusName: virusName,
            virusFamily: numMapping[groupid],
            strainNum: parseInt(numInfo[0]),
            genomeNum: parseInt(numInfo[1])
        })
    });
    return numList;
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
        classpage('strong').each((index, element) => {
            n = classpage(element).text();
            if (n.endsWith('dae')) {
                classList[n] = title;
            }
        });
    })
    return classList;
}

const dirpath = path.resolve(__dirname, '..', 'data');

// Call this sychronously because this folder is needed beforehand
if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
}

Promise.all([
    getVirusNum(),
    getViruClass()
]).then(values => {
    virusNum = values[0].map(element => {
        element.virusClass = values[1][element.virusFamily];
        return element;
    });
    fs.writeFile(
        path.resolve(dirpath, 'virusInfo.json'),
        JSON.stringify(virusNum, null, 2),
        (err) => {
            if (err) {
                throw err;
            } else {
                console.log('File saved');
            }
        }
    );
    console.log(virusNum.length);
}).catch(err => {
    console.error(err);
})
