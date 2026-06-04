import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto('https://www.gran-turismo.com/fr/gt7/tracklist/', {
    waitUntil: 'networkidle',
  });

  const tracks = await page.$$eval('tbody tr', (rows) =>
    rows.map((row) => {
      const cells = row.querySelectorAll('td');

      const name =
        cells[0]?.querySelector('.css-6m57do')?.textContent?.trim() ?? null;

      const country = cells[1]?.textContent?.trim() ?? null;

      const length = cells[2]?.textContent?.trim() ?? null;

      return {
        name,
        country,
        length,
      };
    }),
  );

  fs.writeFileSync('scraped/tracks_raw.json', JSON.stringify(tracks, null, 2));

  console.log(`Found ${tracks.length} tracks`);

  await browser.close();
}

void main();
