// birdsLevels.js
// Static bird data for every continent and level.
export const birdsLevels = [
  {
    id: 1,
    continent: "Europe",
    questions: [
      { id: 1, gameQuestion: 1, commonName: "European Robin", scientificName: "Erithacus rubecula", lat: 51.5, lng: -0.1, country: "United Kingdom" },
      { id: 2, gameQuestion: 7, commonName: "Common Blackbird", scientificName: "Turdus merula", lat: 52.5, lng: 13.4, country: "Germany" },
      { id: 3, gameQuestion: 2, commonName: "Blue Tit", scientificName: "Cyanistes caeruleus", lat: 48.9, lng: 2.4, country: "France" },
      { id: 4, gameQuestion: 5, commonName: "Common Kingfisher", scientificName: "Alcedo atthis", lat: 47.5, lng: 19.0, country: "Hungary" },
      { id: 5, gameQuestion: 6, commonName: "Great Spotted Woodpecker", scientificName: "Dendrocopos major", lat: 52.2, lng: 21.0, country: "Poland" },
      { id: 6, gameQuestion: 4, commonName: "Eurasian Nuthatch", scientificName: "Sitta europaea", lat: 48.2, lng: 16.4, country: "Austria" },
      { id: 7, gameQuestion: 8, commonName: "Eurasian Treecreeper", scientificName: "Certhia familiaris", lat: 59.3, lng: 18.1, country: "Sweden" },
      { id: 8, gameQuestion: 9, commonName: "Willow Warbler", scientificName: "Phylloscopus trochilus", lat: 60.2, lng: 24.9, country: "Finland" },
      { id: 9, gameQuestion: 3, commonName: "Blackcap", scientificName: "Sylvia atricapilla", lat: 43.3, lng: 11.3, country: "Italy" },
    ],
  },

  {
    id: 2,
    continent: "North America",
    questions: [
      { id: 1, gameQuestion: 2, commonName: "American Robin", scientificName: "Turdus migratorius", lat: 43.7, lng: -79.4, country: "Canada" },
      { id: 2, gameQuestion: 3, commonName: "Blue Jay", scientificName: "Cyanocitta cristata", lat: 42.3, lng: -83.0, country: "United States" },
      { id: 3, gameQuestion: 4, commonName: "Northern Cardinal", scientificName: "Cardinalis cardinalis", lat: 38.6, lng: -90.2, country: "United States" },
      { id: 4, gameQuestion: 6, commonName: "Mourning Dove", scientificName: "Zenaida macroura", lat: 32.8, lng: -96.8, country: "United States" },
      { id: 5, gameQuestion: 1, commonName: "Downy Woodpecker", scientificName: "Dryobates pubescens", lat: 45.5, lng: -73.6, country: "Canada" },
      { id: 6, gameQuestion: 5, commonName: "Black-capped Chickadee", scientificName: "Poecile atricapillus", lat: 44.98, lng: -93.3, country: "United States" },
      { id: 7, gameQuestion: 7, commonName: "White-breasted Nuthatch", scientificName: "Sitta carolinensis", lat: 39.7, lng: -104.9, country: "United States" },
      { id: 8, gameQuestion: 8, commonName: "Dark-eyed Junco", scientificName: "Junco hyemalis", lat: 47.6, lng: -122.3, country: "United States" },
      { id: 9, gameQuestion: 9, commonName: "Cedar Waxwing", scientificName: "Bombycilla cedrorum", lat: 49.3, lng: -123.1, country: "Canada" },
    ],
  },

  {
    id: 3,
    continent: "South America",
    questions: [
      { id: 1, gameQuestion: 1, commonName: "Rufous-collared Sparrow", scientificName: "Zonotrichia capensis", lat: -33.4, lng: -70.7, country: "Chile" },
      { id: 2, gameQuestion: 3, commonName: "Great Kiskadee", scientificName: "Pitangus sulphuratus", lat: -23.6, lng: -46.6, country: "Brazil" },
      { id: 3, gameQuestion: 8, commonName: "Tropical Kingbird", scientificName: "Tyrannus melancholicus", lat: 4.7, lng: -74.1, country: "Colombia" },
      { id: 4, gameQuestion: 7, commonName: "Saffron Finch", scientificName: "Sicalis flaveola", lat: 10.5, lng: -66.9, country: "Venezuela" },
      { id: 5, gameQuestion: 2, commonName: "Southern Lapwing", scientificName: "Vanellus chilensis", lat: -34.6, lng: -58.4, country: "Argentina" },
      { id: 6, gameQuestion: 5, commonName: "Blue-and-yellow Macaw", scientificName: "Ara ararauna", lat: -15.8, lng: -47.9, country: "Brazil" },
      { id: 7, gameQuestion: 4, commonName: "Toco Toucan", scientificName: "Ramphastos toco", lat: -20.5, lng: -54.6, country: "Brazil" },
      { id: 8, gameQuestion: 9, commonName: "Andean Condor", scientificName: "Vultur gryphus", lat: -13.5, lng: -71.9, country: "Peru" },
      { id: 9, gameQuestion: 6, commonName: "Scarlet Macaw", scientificName: "Ara macao", lat: -3.1, lng: -60.0, country: "Brazil" },
    ],
  },

  {
    id: 4,
    continent: "Africa",
    questions: [
      { id: 1, gameQuestion: 2, commonName: "Common Bulbul", scientificName: "Pycnonotus barbatus", lat: 6.5, lng: 3.4, country: "Nigeria" },
      { id: 2, gameQuestion: 9, commonName: "Laughing Dove", scientificName: "Spilopelia senegalensis", lat: -1.3, lng: 36.8, country: "Kenya" },
      { id: 3, gameQuestion: 5, commonName: "African Pied Wagtail", scientificName: "Motacilla aguimp", lat: -26.2, lng: 28.0, country: "South Africa" },
      { id: 4, gameQuestion: 7, commonName: "Speckled Mousebird", scientificName: "Colius striatus", lat: -17.8, lng: 31.0, country: "Zimbabwe" },
      { id: 5, gameQuestion: 1, commonName: "Village Weaver", scientificName: "Ploceus cucullatus", lat: 5.6, lng: -0.2, country: "Ghana" },
      { id: 6, gameQuestion: 8, commonName: "Lilac-breasted Roller", scientificName: "Coracias caudatus", lat: -3.4, lng: 37.3, country: "Tanzania" },
      { id: 7, gameQuestion: 3, commonName: "African Fish Eagle", scientificName: "Icthyophaga vocifer", lat: -15.4, lng: 28.3, country: "Zambia" },
      { id: 8, gameQuestion: 4, commonName: "Secretarybird", scientificName: "Sagittarius serpentarius", lat: -24.7, lng: 25.9, country: "Botswana" },
      { id: 9, gameQuestion: 6, commonName: "Southern Ground-Hornbill", scientificName: "Bucorvus leadbeateri", lat: -24.0, lng: 31.5, country: "South Africa" },
    ],
  },

  {
    id: 5,
    continent: "Asia",
    questions: [
      { id: 1, gameQuestion: 1, commonName: "Eurasian Tree Sparrow", scientificName: "Passer montanus", lat: 35.7, lng: 139.7, country: "Japan" },
      { id: 2, gameQuestion: 7, commonName: "Common Myna", scientificName: "Acridotheres tristis", lat: 28.6, lng: 77.2, country: "India" },
      { id: 3, gameQuestion: 3, commonName: "Oriental Magpie-Robin", scientificName: "Copsychus saularis", lat: 13.8, lng: 100.5, country: "Thailand" },
      { id: 4, gameQuestion: 2, commonName: "Red-whiskered Bulbul", scientificName: "Pycnonotus jocosus", lat: 25.0, lng: 121.5, country: "Taiwan" },
      { id: 5, gameQuestion: 5, commonName: "White-throated Kingfisher", scientificName: "Halcyon smyrnensis", lat: 6.9, lng: 79.9, country: "Sri Lanka" },
      { id: 6, gameQuestion: 9, commonName: "Black Drongo", scientificName: "Dicrurus macrocercus", lat: 23.8, lng: 90.4, country: "Bangladesh" },
      { id: 7, gameQuestion: 6, commonName: "Indian Pitta", scientificName: "Pitta brachyura", lat: 10.0, lng: 76.3, country: "India" },
      { id: 8, gameQuestion: 4, commonName: "Crested Serpent Eagle", scientificName: "Spilornis cheela", lat: 3.1, lng: 101.7, country: "Malaysia" },
      { id: 9, gameQuestion: 8, commonName: "Asian Paradise Flycatcher", scientificName: "Terpsiphone paradisi", lat: 27.7, lng: 85.3, country: "Nepal" },
    ],
  },

  {
    id: 6,
    continent: "Oceania",
    questions: [
      { id: 1, gameQuestion: 2, commonName: "Australian Magpie", scientificName: "Gymnorhina tibicen", lat: -37.8, lng: 144.9, country: "Australia" },
      { id: 2, gameQuestion: 4, commonName: "Rainbow Lorikeet", scientificName: "Trichoglossus moluccanus", lat: -33.9, lng: 151.2, country: "Australia" },
      { id: 3, gameQuestion: 5, commonName: "Sulphur-crested Cockatoo", scientificName: "Cacatua galerita", lat: -27.5, lng: 153.0, country: "Australia" },
      { id: 4, gameQuestion: 1, commonName: "Superb Fairywren", scientificName: "Malurus cyaneus", lat: -34.9, lng: 138.6, country: "Australia" },
      { id: 5, gameQuestion: 3, commonName: "Laughing Kookaburra", scientificName: "Dacelo novaeguineae", lat: -35.3, lng: 149.1, country: "Australia" },
      { id: 6, gameQuestion: 6, commonName: "Noisy Miner", scientificName: "Manorina melanocephala", lat: -28.0, lng: 153.4, country: "Australia" },
      { id: 7, gameQuestion: 7, commonName: "Tui", scientificName: "Prosthemadera novaeseelandiae", lat: -36.8, lng: 174.8, country: "New Zealand" },
      { id: 8, gameQuestion: 8, commonName: "Kea", scientificName: "Nestor notabilis", lat: -45.0, lng: 168.7, country: "New Zealand" },
      { id: 9, gameQuestion: 9, commonName: "Tawaki", scientificName: "Eudyptes pachyrhynchus", lat: -46.6, lng: 168.4, country: "New Zealand" },
    ],
  },

  {
    id: 7,
    continent: "Antarctica",
    questions: [
      { id: 1, gameQuestion: 7, commonName: "Adelie Penguin", scientificName: "Pygoscelis adeliae", lat: -64.8, lng: -62.9, country: "Antarctica" },
      { id: 2, gameQuestion: 8, commonName: "Gentoo Penguin", scientificName: "Pygoscelis papua", lat: -64.8, lng: -63.5, country: "Antarctica" },
      { id: 3, gameQuestion: 6, commonName: "Chinstrap Penguin", scientificName: "Pygoscelis antarcticus", lat: -62.0, lng: -58.3, country: "Antarctica" },
      { id: 4, gameQuestion: 2, commonName: "Snow Petrel", scientificName: "Pagodroma nivea", lat: -67.6, lng: 62.9, country: "Antarctica" },
      { id: 5, gameQuestion: 3, commonName: "Cape Petrel", scientificName: "Daption capense", lat: -54.3, lng: 3.4, country: "Antarctica" },
      { id: 6, gameQuestion: 5, commonName: "Wilson's Storm-Petrel", scientificName: "Oceanites oceanicus", lat: -60.7, lng: -45.0, country: "Antarctica" },
      { id: 7, gameQuestion: 9, commonName: "South Polar Skua", scientificName: "Stercorarius maccormicki", lat: -77.8, lng: 166.7, country: "Antarctica" },
      { id: 8, gameQuestion: 4, commonName: "Antarctic Petrel", scientificName: "Thalassoica antarctica", lat: -70.4, lng: 2.3, country: "Antarctica" },
      { id: 9, gameQuestion: 1, commonName: "Emperor Penguin", scientificName: "Aptenodytes forsteri", lat: -77.9, lng: 166.8, country: "Antarctica" },
    ],
  },
];



// Returns the single question object for a given gameQuestion number (1–9) in a continent.
// Returns null if not found.
export function getQuestionByNumber(continent, gameQuestion) {
  const continentData = birdsLevels.find(c => c.continent === continent);
  if (!continentData) return null;
  return continentData.questions.find(q => q.gameQuestion === gameQuestion) ?? null;
}

// Returns all 9 questions for a continent.
// Used as the distractor pool and to build map waypoints.
export function getAllQuestionsForContinent(continent) {
  const continentData = birdsLevels.find(c => c.continent === continent);
  if (!continentData) return [];
  return continentData.questions;
}

// Returns 3 distractor common names from the same continent,
// excluding the correct answer. Used to build the 4-choice buttons.
export function getDistractors(continent, correctCommonName) {
  const allBirds = getAllQuestionsForContinent(continent);
  const pool = allBirds
    .map(q => q.commonName)
    .filter(name => name !== correctCommonName);
  // shuffle and take 3
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// Returns the list of all continent names — used by ContinentSelectView.
export function getContinentNames() {
  return birdsLevels.map(c => c.continent);
}
