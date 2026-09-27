// birdSource.js

const XENO_CANTO_API_KEY = process.env.EXPO_PUBLIC_XENO_CANTO_API_KEY;


export async function fetchBirdImage(commonName) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(commonName)}`;

  const headers = {
    'User-Agent': 'Birdify/1.0',
    'Api-User-Agent': 'Birdify/1.0'
  };

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Wikipedia error ${response.status} for "${commonName}"`);
  const data = await response.json();
  // console.log(data.thumbnail?.source);
  return {
    imageUrl: data.thumbnail?.source ?? null,
    wikiExtract: data.extract ?? "",
  };
}


export async function fetchBirdAudio(scientificName) {
  const query = encodeURIComponent(`sp:"${scientificName}"`);
  const url = `https://xeno-canto.org/api/3/recordings?query=${query}&key=${XENO_CANTO_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`xeno-canto error ${response.status} for "${scientificName}"`);
  const data = await response.json();
  const recording = data.recordings?.[0];
  if (!recording) throw new Error(`No audio found for "${scientificName}"`);
  // console.log(recording.file);
  return {
    audioUrl: `${recording.file}`,
    audioCredit: `Recorded by ${recording.rec} · XC${recording.id}`,
  };
}
