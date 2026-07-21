const fs = require("fs");
const path = require("path");

/**
 * TabiMap Data Pipeline
 * 
 * Run this script to generate the final destinations-index.json from raw data.
 * It combines the logic from the deprecated scripts (geocoding, formatting, etc.)
 * into a single repeatable pipeline for adding new destinations (e.g., Kansai region).
 */

const RAW_DATA_PATH = path.join(__dirname, "../src/shared/data/destinations-index.json");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function runPipeline() {
  console.log("Starting TabiMap data pipeline...");
  
  // 1. Read Raw JSON
  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(RAW_DATA_PATH, "utf8"));
  } catch (e) {
    console.error("Failed to read destinations JSON:", e);
    process.exit(1);
  }
  console.log(`Loaded ${rawData.length} destinations.`);

  // 2. Geocode / Validate Coordinates
  console.log("Validating coordinates...");
  let geocodedCount = 0;
  for (let dest of rawData) {
    if (dest.coordinates && dest.coordinates.lat && dest.coordinates.lng) continue;
    
    try {
      const q = encodeURIComponent(`${dest.name}, ${dest.prefecture || "Tokyo"}, Japan`);
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
      const res = await fetch(url, { headers: { "User-Agent": "TabiMap-Pipeline/1.0" } });
      const results = await res.json();

      if (results && results.length > 0) {
        dest.coordinates = {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
        console.log(`Geocoded ${dest.name}: ${dest.coordinates.lat}, ${dest.coordinates.lng}`);
        geocodedCount++;
      } else {
        console.log(`Could not geocode ${dest.name}, falling back to Tokyo.`);
        dest.coordinates = { lat: 35.6762, lng: 139.6503 };
      }
    } catch (e) {
      console.error(`Geocoding error for ${dest.name}:`, e);
      dest.coordinates = { lat: 35.6762, lng: 139.6503 };
    }
    await delay(1500); // Respect OSM rate limits
  }

  // 3. Normalize Budgets
  console.log("Normalizing budgets...");
  let normalizedBudgetsCount = 0;
  for (let d of rawData) {
    if (d.budgetMin && d.budgetMax) {
      const expectedRec = Math.round((d.budgetMin + d.budgetMax) / 2);
      if (d.budgetRecommended !== expectedRec) {
        d.budgetRecommended = expectedRec;
        normalizedBudgetsCount++;
      }
    }
  }

  // 4. Validate Images & Content
  console.log("Validating image assets...");
  let missingImagesCount = 0;
  for (let d of rawData) {
    if (!d.heroImage || d.heroImage.trim() === "") {
      console.warn(`\x1b[33m[WARNING] Destination '${d.name}' (${d.id}) is missing a heroImage.\x1b[0m`);
      missingImagesCount++;
    }
  }

  // 5. Write Final Output
  console.log("Writing pipeline output...");
  fs.writeFileSync(RAW_DATA_PATH, JSON.stringify(rawData, null, 2));
  
  console.log(`Pipeline complete! Validated ${rawData.length} destinations.`);
  console.log(`- Geocoded: ${geocodedCount} destinations`);
  console.log(`- Budgets Normalized: ${normalizedBudgetsCount} destinations`);
  if (missingImagesCount > 0) {
    console.log(`\x1b[33m- Missing Images: ${missingImagesCount} destinations require manual image sourcing.\x1b[0m`);
  } else {
    console.log(`- Images Validated: All destinations have images.`);
  }
}

runPipeline().catch(console.error);
