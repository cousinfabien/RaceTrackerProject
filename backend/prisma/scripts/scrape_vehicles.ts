import { chromium } from 'playwright';
import fs from 'fs';

interface RawVehicle {
  model: string;
  transmission: string;
  power: number | null;
  torque: number | null;
  weight: number | null;
  aspiration: string;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://www.gran-turismo.com/fr/gt7/carlist/classic', {
    waitUntil: 'networkidle',
  });

  const rows = await page.locator('tr').all();

  const vehicles: RawVehicle[] = [];

  for (let i = 1; i < rows.length; i++) {
    const text = await rows[i].innerText();

    const cols = text
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);

    vehicles.push({
      model: cols[0],

      transmission: cols[1],

      power: cols[2] === '- ch' ? null : parseInt(cols[2].replace(/\D/g, '')),

      torque:
        cols[3] === '- Nm'
          ? null
          : parseFloat(cols[3].replace('- Nm', '').replace(',', '.')),

      weight: cols[7] === '- kg' ? null : parseInt(cols[7].replace(/\D/g, '')),

      aspiration: cols[8],
    });
  }

  fs.writeFileSync(
    'scraped/vehicles_raw.json',
    JSON.stringify(vehicles, null, 2),
  );

  console.log(`Saved ${vehicles.length} cars`);

  await browser.close();
}

void main();
