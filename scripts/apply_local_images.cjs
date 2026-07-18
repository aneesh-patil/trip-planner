const fs = require('fs');

const imageMap = {
  "hakone-onsen": "/images/hakone_hero.jpg",
  "kamakura-history": "/images/kamakura_hero.jpg",
  "kawagoe-edo": "/images/kawagoe_hero.jpg",
  "nikko-heritage": "/images/nikko_hero.jpg",
  "yokohama-city": "/images/yokohama_hero.jpg",
  "atami-resort": "/images/atami_hero.jpg",
  "boso-peninsula": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/B%C5%8Ds%C5%8D_Peninsula_by_Sentinel-2%2C_2018-10-30.jpg/960px-B%C5%8Ds%C5%8D_Peninsula_by_Sentinel-2%2C_2018-10-30.jpg",
  "matsumoto": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Matsumoto_Castle_Keep_Tower.jpg/960px-Matsumoto_Castle_Keep_Tower.jpg",
  "harry-potter-studio": "/images/harry-potter-studio.jpg",
  "karuizawa": "/images/karuizawa.jpg",
  "utsunomiya-oya": "/images/utsunomiya-oya.jpg",
  "disneysea": "/images/disneysea.jpg",
  "tsukuba": "/images/tsukuba.jpg",
  "omiya-railway": "/images/omiya-railway.jpg",
  "joypolis": "/images/joypolis.jpg"
};

const dests = JSON.parse(fs.readFileSync('src/data/destinations.json', 'utf8'));

dests.forEach(d => {
  if (imageMap[d.id]) {
    d.heroImage = imageMap[d.id];
  }
});

fs.writeFileSync('src/data/destinations.json', JSON.stringify(dests, null, 2));
