const fs = require("fs");

async function geocode() {
  const data = JSON.parse(
    fs.readFileSync("src/data/destinations.json", "utf-8"),
  );
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let dest of data) {
    if (dest.coordinates) continue;
    try {
      const q = encodeURIComponent(
        `${dest.name}, ${dest.prefecture || "Tokyo"}, Japan`,
      );
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "TravelApp/1.0" },
      });
      const results = await res.json();

      if (results && results.length > 0) {
        dest.coordinates = {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
        console.log(
          `Geocoded ${dest.name}: ${dest.coordinates.lat}, ${dest.coordinates.lng}`,
        );
      } else {
        console.log(`Could not geocode ${dest.name}`);
        // fallback to tokyo if failing for some weird wards
        dest.coordinates = { lat: 35.6762, lng: 139.6503 };
      }
    } catch (e) {
      console.error(e);
      dest.coordinates = { lat: 35.6762, lng: 139.6503 };
    }
    await delay(1500); // Respect OSM rate limits
  }

  fs.writeFileSync("src/data/destinations.json", JSON.stringify(data, null, 2));
}

geocode();
