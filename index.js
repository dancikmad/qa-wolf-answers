const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com');

  // Wait for the table rows to load
  await page.waitForSelector('.athing');

  // Extract titles and URLs
  const titlesAndUrls = await page.$$eval('.athing', rows => {
    const data = [];
    for (const row of rows.slice(0, 10)) {
      const title = row.querySelector('.title a').textContent.trim();
      const url = row.querySelector('.title a').href;
      data.push({ title, url });
    }
    return data;
  });

  // Write data to CSV file
  let csvData = 'TITLE,URL\n';
  titlesAndUrls.forEach(item => {
    csvData += `${item.title},${item.url}\n`;
  });
  fs.writeFileSync('top_10_hacker_news.csv', csvData);

  console.info('Scrapping Data from https://news.ycombinator.com')
  console.info('Data scraped and written to hacker_news.csv');

  await browser.close();
})();
