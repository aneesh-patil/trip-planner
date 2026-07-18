const fs = require("fs");
const dests = JSON.parse(fs.readFileSync("src/data/destinations.json", "utf8"));

const localImages = [
  "/images/hakone_hero.jpg",
  "/images/kamakura_hero.jpg",
  "/images/kawagoe_hero.jpg",
  "/images/nikko_hero.jpg",
  "/images/yokohama_hero.jpg",
  "/images/atami_hero.jpg",
];

dests.forEach((d, i) => {
  if (d.heroImage.startsWith("http")) {
    d.heroImage = localImages[i % localImages.length];
  }
});

fs.writeFileSync("src/data/destinations.json", JSON.stringify(dests, null, 2));
