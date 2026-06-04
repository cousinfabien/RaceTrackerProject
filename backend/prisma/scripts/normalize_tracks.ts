import fs from 'fs';

interface RawTrack {
  name: string;
  country: string;
  length: string;
}

interface NormalizedTrack {
  name: string;
  layout: string | null;
  country: string;
  trackLength: number | null;
}

const rawTracks: RawTrack[] = JSON.parse(
  fs.readFileSync('scraped/tracks_raw.json', 'utf8'),
) as RawTrack[];

const normalizedTracks: NormalizedTrack[] = rawTracks.map((track) => {
  let circuitName = track.name;
  let layout: string | null = null;

  if (track.name.includes(' : ')) {
    const parts = track.name.split(' : ');

    circuitName = parts[0].trim();
    layout = parts[1].trim();
  } else if (track.name.includes(' - ')) {
    const parts = track.name.split(' - ');

    circuitName = parts[0].trim();
    layout = parts.slice(1).join(' - ').trim();
  }

  if (layout?.includes('Yamagiwa+Miyabi')) {
    layout = layout.replace('Yamagiwa+Miyabi', 'Yamagiwa + Miyabi');
  }

  const trackLength = track.length
    ? Number(track.length.replace(/\s/g, '').replace('m', '')) / 1000
    : null;

  return {
    name: circuitName,
    layout,
    country: track.country,
    trackLength,
  };
});

const duplicates = normalizedTracks.filter(
  (track, index, self) =>
    index !==
    self.findIndex((t) => t.name === track.name && t.layout === track.layout),
);

console.log('Duplicates:', duplicates);

fs.writeFileSync(
  'seeds/tracks.json',
  JSON.stringify(normalizedTracks, null, 2),
);

console.log(`Normalized ${normalizedTracks.length} tracks`);
