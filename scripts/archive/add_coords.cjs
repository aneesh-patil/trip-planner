const fs = require("fs");
const dests = JSON.parse(fs.readFileSync("src/data/destinations.json", "utf8"));

const coords = {
  "hakone-onsen": { lat: 35.2324, lng: 139.1069 },
  "kamakura-history": { lat: 35.3192, lng: 139.5467 },
  "kawagoe-edo": { lat: 35.9251, lng: 139.4858 },
  "nikko-heritage": { lat: 36.7199, lng: 139.6982 },
  "yokohama-city": { lat: 35.4437, lng: 139.638 },
  "atami-resort": { lat: 35.0956, lng: 139.0722 },
  "boso-peninsula": { lat: 35.1584, lng: 139.8222 },
  matsumoto: { lat: 36.238, lng: 137.9711 },
  "harry-potter-studio": { lat: 35.7411, lng: 139.6469 },
  karuizawa: { lat: 36.3426, lng: 138.636 },
  "utsunomiya-oya": { lat: 36.5987, lng: 139.816 },
  disneysea: { lat: 35.6267, lng: 139.8851 },
  tsukuba: { lat: 36.2253, lng: 140.1068 },
  "omiya-railway": { lat: 35.9211, lng: 139.6186 },
  joypolis: { lat: 35.6288, lng: 139.7766 },
};

dests.forEach((d) => {
  if (coords[d.id]) {
    d.lat = coords[d.id].lat;
    d.lng = coords[d.id].lng;
  }
});

fs.writeFileSync("src/data/destinations.json", JSON.stringify(dests, null, 2));
