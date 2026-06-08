import fs from 'fs/promises';

export const manufacturers = [
  'Abarth',
  'AFEELA',
  'Alfa Romeo',
  'Alpine',
  'AMG',
  'Amuse',
  'Aston Martin',
  'Audi',
  'Autobianchi',
  'BAC',
  'BMW',
  'Bugatti',
  'BVLGARI',
  'Chaparral',
  'Chevrolet',
  'Chris Holstrom Concepts',
  'Citroën',
  'Daihatsu',
  'De Tomaso',
  'DMC',
  'Dodge',
  'DS Automobiles',
  "Eckert's Rod & Custom",
  'Ferrari',
  'FIAT',
  'Ford',
  'Genesis',
  'Gran Turismo',
  'GReddy',
  'Garage RCR',
  'Greening Auto Company',
  'Honda',
  'Hyundai',
  'Infiniti',
  'Italdesign',
  'Jaguar',
  'Jeep',
  'KTM',
  'Lamborghini',
  'Lancia',
  'Lexus',
  'Maserati',
  'Mazda',
  'McLaren',
  'Mercedes-Benz',
  "Mine's",
  'MINI',
  'Mitsubishi',
  'Nismo',
  'Nissan',
  'Opel',
  'Pagani',
  'Peugeot',
  'Plymouth',
  'Polestar',
  'Pontiac',
  'Porsche',
  'Radical',
  'Roadster Shop',
  'RE Amemiya',
  'Renault',
  'RUF',
  'Shelby',
  'Subaru',
  'Super Formula',
  'Suzuki',
  'Tesla',
  'Toyota',
  'TVR',
  'Volkswagen',
  'Volvo',
  'Wicked Fabrication',
  'Xiaomi',
  'Yangwang',
  'Zagato',
  'Škoda',
];

interface RawCar {
  model: string;
  power: number | null;
  weight: number | null;
}

interface Vehicle {
  manufacturer: string;
  model: string;

  basePower: number | null;
  baseWeight: number | null;

  category: string | null;
}

async function main() {
  const raw: RawCar[] = JSON.parse(
    await fs.readFile('scraped/vehicles_raw.json', 'utf-8'),
  ) as RawCar[];

  const vehicles: Vehicle[] = [];

  const overrides: Record<string, string> = {
    '1932 Ford Roadster': 'Ford',

    'DAIHATSU COPEN RJ Vision Gran Turismo': 'Daihatsu',

    "DS 3 Racing '11": 'DS Automobiles',

    "Dallara SF19 Super Formula / Honda '19": 'Super Formula',
    "Dallara SF19 Super Formula / Toyota '19": 'Super Formula',
    "Dallara SF23 Super Formula / Honda '23": 'Super Formula',
    "Dallara SF23 Super Formula / Toyota '23": 'Super Formula',

    "Enzo Ferrari '02": 'Ferrari',

    'GT by Citroën Gr.4': 'Citroën',
    'GT by Citroën Race Car (Gr.3)': 'Citroën',
    'GT by Citroën Road Car': 'Citroën',

    'IsoRivolta Zagato Vision Gran Turismo': 'Zagato',

    'Lambo V12 Vision Gran Turismo': 'Lamborghini',

    "Mercedes-AMG C 63 S '15": 'AMG',
    "Mercedes-AMG GT Black Series '20": 'AMG',
    "Mercedes-AMG GT R '17": 'AMG',
    "Mercedes-AMG GT S '15": 'AMG',
    'Mercedes-AMG GT Safety Car': 'AMG',
    "Mercedes-AMG GT3 '16": 'AMG',
    "Mercedes-AMG GT3 '20": 'AMG',

    "Mini-Cooper 'S' '65": 'MINI',

    "Sauber Mercedes C9 '89": 'Mercedes-Benz',
  };

  const sortedManufacturers = [...manufacturers].sort(
    (a, b) => b.length - a.length,
  );

  for (const car of raw) {
    let manufacturer: string | undefined = overrides[car.model];

    let model = car.model;

    if (!manufacturer) {
      manufacturer = sortedManufacturers.find((m) =>
        car.model.toLowerCase().startsWith(m.toLowerCase()),
      );

      if (!manufacturer) {
        console.log('UNKNOWN:', car.model);
        continue;
      }

      model = car.model.substring(manufacturer.length).trim();
    }

    vehicles.push({
      manufacturer,
      model,
      basePower: car.power,
      baseWeight: car.weight,
      category: null,
    });
  }

  await fs.writeFile('seeds/vehicles.json', JSON.stringify(vehicles, null, 2));

  console.log(`Saved ${vehicles.length} vehicles`);
}

void main();
