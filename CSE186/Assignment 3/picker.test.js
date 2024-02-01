const puppeteer = require('puppeteer');

/**
 * @param {number} relative months ahead or behind the current date
 * @return {date} first day of the relative month
 */
function firstDay(relative) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth()+relative);
  return date.getDay();
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
});

// Clicks the next button a random number of times then checks the first
// day of the displayed month is correct.  For example, July 1, 2021 falls
// on a Thursday, the 5h day of the week when weeks start on Sundays.
test('Next Months', async () => {
  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/picker.html`);
  const relative = Math.max(1, Math.floor(Math.random()*28));
  for (let i = 0; i < relative; i++) {
    await page.click('#next');
  }
  const elem = await page.$('#d'+firstDay(relative));
  const cont = await (await elem.getProperty('textContent')).jsonValue();
  expect(cont).toBe('1');
});

// //////////////////////////////////////////////////////////
//
// Add your tests for the Advanced requirement below here
//
// //////////////////////////////////////////////////////////

/**
 * @param {number} relative months ahead or behind the current date
 * @return {date} first day of the relative month
 */
function firstDayprev(relative) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth()-relative);
  return date.getDay();
}
// Clicks the prev button a random number of times then checks the first
// day of the displayed month is correct.
test('Prev Months', async () => {
  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/picker.html`);
  const relative = Math.max(1, Math.floor(Math.random()*28));
  for (let i = 0; i < relative; i++) {
    await page.click('#prev');
  }
  const elem = await page.$('#d'+firstDayprev(relative));
  const cont = await (await elem.getProperty('textContent')).jsonValue();
  expect(cont).toBe('1');
});
