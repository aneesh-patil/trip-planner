const fs = require("fs");

const unsplashMap = {
  "hakone-onsen":
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop", // Onsen/nature
  "kamakura-history":
    "https://images.unsplash.com/photo-1542880941-185412fb10d3?q=80&w=1000&auto=format&fit=crop", // Buddha
  "kawagoe-edo":
    "https://images.unsplash.com/photo-1627918451151-5eeab45f65bc?q=80&w=1000&auto=format&fit=crop", // Traditional street
  "nikko-heritage":
    "https://images.unsplash.com/photo-1601005128362-e611e9f1a21e?q=80&w=1000&auto=format&fit=crop", // Temple/Autumn
  "yokohama-city":
    "https://images.unsplash.com/photo-1558204686-e4142f36d418?q=80&w=1000&auto=format&fit=crop", // Yokohama night view
  "atami-resort":
    "https://images.unsplash.com/photo-1583335501997-25e17e94e503?q=80&w=1000&auto=format&fit=crop", // Ocean view
  "boso-peninsula":
    "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000&auto=format&fit=crop", // Coastal drive
  matsumoto:
    "https://images.unsplash.com/photo-1590559899731-a382839ce25b?q=80&w=1000&auto=format&fit=crop", // Castle
  "harry-potter-studio":
    "https://images.unsplash.com/photo-1618944847023-38aa001235f0?q=80&w=1000&auto=format&fit=crop", // Magical/Indoor
  karuizawa:
    "https://images.unsplash.com/photo-1542051812871-757500d72bc1?q=80&w=1000&auto=format&fit=crop", // Forest/Nature
  "utsunomiya-oya":
    "https://images.unsplash.com/photo-1616421316438-bb2f7be625ee?q=80&w=1000&auto=format&fit=crop", // Cave/Stone
  disneysea:
    "https://images.unsplash.com/photo-1505993597083-3ae4f67aa239?q=80&w=1000&auto=format&fit=crop", // Theme park
  tsukuba:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", // Mountain view
  "omiya-railway":
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1000&auto=format&fit=crop", // Train
  joypolis:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop", // Arcade/Neon
};

const dests = JSON.parse(fs.readFileSync("src/data/destinations.json", "utf8"));

dests.forEach((d) => {
  if (unsplashMap[d.id]) {
    d.heroImage = unsplashMap[d.id];
  }
});

fs.writeFileSync("src/data/destinations.json", JSON.stringify(dests, null, 2));
