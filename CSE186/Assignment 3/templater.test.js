
const puppeteer = require('puppeteer');
const fs = require('fs');

/** @return {number} */
function age() {
  return 20 + Math.floor(Math.random() * 60);
}

const fnames = ['John', 'Paul', 'George', 'Ringo'];
const lnames = ['Lennon', 'McCartney', 'Harrison', 'Starr'];

/** @return {string} */
function nam() {
  return fnames[Math.floor(Math.random()*fnames.length)] + ' ' +
    lnames[Math.floor(Math.random()*lnames.length)];
}

/** @return {string} */
function add() {
  return age() + ' Penny Lane';
}

/** @return {string} */
function generate() {
  return {
    H1: 'Name', H2: 'Address', H3: 'Age',
    R11: nam(), R12: add(), R13: '' + age(),
    R21: nam(), R22: add(), R23: '' + age(),
    R31: nam(), R32: add(), R33: '' + age(),
    R41: nam(), R42: add(), R43: '' + age(),
    R51: nam(), R52: add(), R53: '' + age(),
  };
}

const tags = [];

/** @return {string} */
function randomTag() {
  let tag;
  while (true) {
    tag = 'T' + (1000 + Math.floor(Math.random() * 9000));
    if (!tags.includes(tag)) {
      tags.push(tag);
      break;
    }
  }
  return tag;
}

/**
 * @param {boolean} sparse
 * @return {object}
 */
function randomise(sparse) {
  const content = fs.readFileSync(
      `${__dirname}/templater.html`, {encoding: 'utf8', flag: 'r'});
  const data = generate();
  let result = content;
  let json = '{';
  const map = new Map();
  const empty = [];
  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      const tag = randomTag();
      result = result.replace('"'+prop+'"', '"'+tag+'"');
      if (sparse && (Math.random() < 0.5)) {
        empty.push(tag);
        delete data[prop];
      } else {
        if (json.length > 1) {
          json += ',';
        }
        json += '"' +tag +'":"' + data[prop] + '"';
      }
      map[tag] = prop;
    }
  }
  json += '}';
  fs.writeFileSync(`${__dirname}/tagged.templater.html`, result, 'utf8');
  return {data: data, obf: JSON.parse(json), map: map, empty: empty};
}

let browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
    ],
  });
});

afterEach(async () => {
  await browser.close();
  fs.unlinkSync(`${__dirname}/tagged.templater.html`);
});

/**
 * @param {boolean} byTag
 * @param {boolean} sparse
 */
async function basic(byTag, sparse) {
  const all = randomise(sparse);
  const data = all.data;
  const obf = all.obf;
  // const map = all.map;
  const empty = all.empty;
  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/tagged.templater.html`);
  await page.$eval('#json', (el) => el.value = '');
  const json = await page.$('#json');
  await json.focus();
  await page.keyboard.type(JSON.stringify(byTag?data:obf));
  await page.waitForTimeout(100);
  await page.click('#'+(byTag?'byTag':'byId'));
  await page.waitForTimeout(1000);
  for (const prop in obf) {
    if (obf.hasOwnProperty(prop)) {
      const elem = await page.$('#'+prop);
      const cont = await (await elem.getProperty('textContent')).jsonValue();
      expect(cont).toBe(obf[prop]);
    }
  }
  for (const prop of empty) {
    if (empty.hasOwnProperty(prop)) {
      const elem = await page.$('#'+prop);
      const cont = await (await elem.getProperty('textContent')).jsonValue();
      expect(cont).toBe('');
    }
  }
}

test('By Tag Dense', async () => {
  await basic(true, false);
});

test('By Tag Sparse', async () => {
  await basic(true, true);
});

test('By ID Dense', async () => {
  await basic(false, false);
});

test('By ID Sparse', async () => {
  await basic(false, true);
});

