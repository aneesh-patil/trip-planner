const fs = require('fs');
const https = require('https');
const path = require('path');

const pageTitles = {
  "hakone-onsen": "Hakone_Shrine",
  "kamakura-history": "Kōtoku-in",
  "kawagoe-edo": "Kawagoe,_Saitama",
  "nikko-heritage": "Nikkō_Tōshō-gū",
  "yokohama-city": "Minatomirai",
  "atami-resort": "Atami",
  "boso-peninsula": "Bōsō_Peninsula",
  "matsumoto": "Matsumoto_Castle",
  "harry-potter-studio": "Warner_Bros._Studio_Tour_Tokyo_-_The_Making_of_Harry_Potter",
  "karuizawa": "Karuizawa",
  "utsunomiya-oya": "Ōya-ji",
  "disneysea": "Tokyo_DisneySea",
  "tsukuba": "Mount_Tsukuba",
  "omiya-railway": "Railway_Museum_(Saitama)",
  "joypolis": "Joypolis"
};

const dests = JSON.parse(fs.readFileSync('src/data/destinations.json', 'utf8'));
const imagesDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function fetchWikiImage(title) {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`;
    https.get(url, { headers: { 'User-Agent': 'TripPlannerBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`/images/${filename}`);
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  for (const dest of dests) {
    const title = pageTitles[dest.id];
    console.log(`Fetching ${title} for ${dest.id}...`);
    const imageUrl = await fetchWikiImage(title);
    
    if (imageUrl) {
      console.log(`Found image: ${imageUrl}`);
      const localPath = await downloadImage(imageUrl, `${dest.id}.jpg`);
      if (localPath) {
        dest.heroImage = localPath;
      }
    } else {
      console.log(`No image found for ${title}`);
    }
  }

  fs.writeFileSync('src/data/destinations.json', JSON.stringify(dests, null, 2));
  console.log('Done!');
}

main();
