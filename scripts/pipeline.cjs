const fs = require("fs");
const path = require("path");

/**
 * TabiMap Data Pipeline
 *
 * Consolidates data ingestion, validation, geocoding, normalization, and output.
 *
 * Usage:
 *   node scripts/pipeline.cjs [options]
 *
 * Options:
 *   --input <path>      Path to input JSON (default: src/shared/data/destinations-index.json)
 *   --output <path>     Path to output JSON (default: same as input)
 *   --dry-run           Run validation and enrichment without writing to file
 *   --validate-only     Run schema validation only and exit
 */

// Parse CLI flags
const args = process.argv.slice(2);
function getArgValue(flag) {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
}

const isDryRun = args.includes("--dry-run");
const isValidateOnly = args.includes("--validate-only");
const customInput = getArgValue("--input");
const customOutput = getArgValue("--output");

const DEFAULT_FILE = path.join(
  __dirname,
  "../src/shared/data/destinations-index.json",
);
const inputPath = customInput
  ? path.resolve(process.cwd(), customInput)
  : DEFAULT_FILE;
const outputPath = customOutput
  ? path.resolve(process.cwd(), customOutput)
  : inputPath;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const REQUIRED_FIELDS = [
  "id",
  "name",
  "prefecture",
  "region",
  "categories",
  "budgetMin",
  "budgetMax",
  "transportOptions",
  "ratings",
];

const RATING_KEYS = [
  "overall",
  "couple",
  "summer",
  "winter",
  "rain",
  "food",
  "photography",
  "relaxation",
  "value",
  "uniqueness",
];

async function runPipeline() {
  console.log("\x1b[36m=============================================\x1b[0m");
  console.log("\x1b[36m        TabiMap Data Pipeline v2.0           \x1b[0m");
  console.log("\x1b[36m=============================================\x1b[0m");
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  if (isDryRun) console.log("\x1b[33mMode:   [DRY RUN - No files will be modified]\x1b[0m");
  if (isValidateOnly) console.log("\x1b[33mMode:   [VALIDATE ONLY]\x1b[0m");
  console.log("");

  // 1. Load Data
  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (e) {
    console.error(`\x1b[31m[ERROR] Failed to read input file (${inputPath}):\x1b[0m`, e.message);
    process.exit(1);
  }
  console.log(`\x1b[32m✔ Loaded ${rawData.length} destinations.\x1b[0m\n`);

  // 2. Stage 1: Schema & Content Validation
  console.log("Stage 1: Schema & Rating Validation...");
  let schemaErrors = 0;
  let schemaWarnings = 0;

  rawData.forEach((dest, index) => {
    const label = dest.name || dest.id || `Item #${index + 1}`;

    // Check required top-level fields
    for (const field of REQUIRED_FIELDS) {
      if (dest[field] === undefined || dest[field] === null) {
        console.error(`  \x1b[31m❌ [${label}] Missing required field '${field}'\x1b[0m`);
        schemaErrors++;
      }
    }

    // Check ratings bounds (1-10)
    if (dest.ratings) {
      for (const rKey of RATING_KEYS) {
        const val = dest.ratings[rKey];
        if (val === undefined || typeof val !== "number") {
          console.error(`  \x1b[31m❌ [${label}] Missing rating '${rKey}'\x1b[0m`);
          schemaErrors++;
        } else if (val < 1 || val > 10) {
          console.warn(`  \x1b[33m⚠️  [${label}] Rating '${rKey}' out of bounds (1-10): ${val}\x1b[0m`);
          schemaWarnings++;
        }
      }
    }

    // Check budget consistency
    if (typeof dest.budgetMin === "number" && typeof dest.budgetMax === "number") {
      if (dest.budgetMin > dest.budgetMax) {
        console.error(`  \x1b[31m❌ [${label}] budgetMin (${dest.budgetMin}) > budgetMax (${dest.budgetMax})\x1b[0m`);
        schemaErrors++;
      }
    }
  });

  if (schemaErrors > 0) {
    console.error(`\n\x1b[31mStage 1 Failed with ${schemaErrors} schema error(s).\x1b[0m`);
    process.exit(1);
  } else {
    console.log(`\x1b[32m✔ Stage 1 Passed (${schemaWarnings} warning(s)).\x1b[0m\n`);
  }

  if (isValidateOnly) {
    console.log("\x1b[32mValidation complete. Exiting (--validate-only).\x1b[0m");
    return;
  }

  // 3. Stage 2: Geocoding Validation & Auto-fill
  console.log("Stage 2: Coordinates & Geocoding...");
  let geocodedCount = 0;

  for (const dest of rawData) {
    if (dest.coordinates && typeof dest.coordinates.lat === "number" && typeof dest.coordinates.lng === "number") {
      continue;
    }

    console.log(`  Geocoding missing coordinates for '${dest.name}'...`);
    try {
      const q = encodeURIComponent(`${dest.name}, ${dest.prefecture || "Tokyo"}, Japan`);
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "TabiMap-Pipeline/2.0" },
      });
      const results = await res.json();

      if (results && results.length > 0) {
        dest.coordinates = {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
        console.log(`  \x1b[32m✔ Geocoded '${dest.name}': ${dest.coordinates.lat}, ${dest.coordinates.lng}\x1b[0m`);
        geocodedCount++;
      } else {
        console.warn(`  \x1b[33m⚠️ Could not geocode '${dest.name}', defaulting to Tokyo coordinates.\x1b[0m`);
        dest.coordinates = { lat: 35.6762, lng: 139.6503 };
      }
    } catch (e) {
      console.error(`  \x1b[31m❌ Geocoding error for '${dest.name}':\x1b[0m`, e.message);
      dest.coordinates = { lat: 35.6762, lng: 139.6503 };
    }
    await delay(1500); // OpenStreetMap rate limit
  }
  console.log(`\x1b[32m✔ Stage 2 Passed (${geocodedCount} newly geocoded).\x1b[0m\n`);

  // 4. Stage 3: Data Normalization
  console.log("Stage 3: Data Normalization...");
  let normalizedBudgets = 0;
  let filledFieldsCount = 0;

  rawData.forEach((d) => {
    if (typeof d.budgetMin === "number" && typeof d.budgetMax === "number") {
      const expectedRec = Math.round((d.budgetMin + d.budgetMax) / 2);
      if (d.budgetRecommended !== expectedRec) {
        d.budgetRecommended = expectedRec;
        normalizedBudgets++;
      }
    }

    if (!d.description) {
      d.description = d.notes || `${d.name} in ${d.prefecture}, Japan.`;
      filledFieldsCount++;
    }
    if (!d.crowd) {
      d.crowd = { weekday: 3, weekend: 4, holiday: 5 };
      filledFieldsCount++;
    }
    if (!d.season) {
      d.season = { spring: 4, summer: 4, autumn: 4, winter: 4 };
      filledFieldsCount++;
    }
    if (!d.highlights) {
      d.highlights = [d.name];
      filledFieldsCount++;
    }
    if (!d.tags) {
      d.tags = d.categories || ["Travel"];
      filledFieldsCount++;
    }
  });
  console.log(`\x1b[32m✔ Stage 3 Passed (${normalizedBudgets} budgets normalized, ${filledFieldsCount} default fields populated).\x1b[0m\n`);

  // 5. Stage 4: Asset Validation
  console.log("Stage 4: Asset Validation...");
  let missingImages = 0;

  rawData.forEach((d) => {
    if (!d.heroImage || d.heroImage.trim() === "") {
      console.warn(`  \x1b[33m⚠️ Missing heroImage for '${d.name}' (${d.id})\x1b[0m`);
      missingImages++;
    }
  });
  console.log(`\x1b[32m✔ Stage 4 Passed (${missingImages} missing image warnings).\x1b[0m\n`);

  // 6. Stage 5: Sort & Format Output
  console.log("Stage 5: Output Generation...");
  rawData.sort((a, b) => a.id.localeCompare(b.id));

  if (isDryRun) {
    console.log("\x1b[33m[DRY RUN] Output would be written to:\x1b[0m", outputPath);
    console.log(`Total valid destinations ready: ${rawData.length}`);
    return;
  }

  fs.writeFileSync(outputPath, JSON.stringify(rawData, null, 2) + "\n");
  console.log(`\x1b[32m✔ Successfully wrote ${rawData.length} processed destinations to ${outputPath}\x1b[0m\n`);
  console.log("\x1b[36m=============================================\x1b[0m");
  console.log("\x1b[36m            Pipeline Complete!               \x1b[0m");
  console.log("\x1b[36m=============================================\x1b[0m");
}

runPipeline().catch((err) => {
  console.error("\x1b[31mPipeline unhandled error:\x1b[0m", err);
  process.exit(1);
});
