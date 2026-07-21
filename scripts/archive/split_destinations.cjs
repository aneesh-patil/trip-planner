const fs = require("fs");
const path = require("path");

const sourceFile = path.join(__dirname, "../src/data/destinations.json");
const indexDest = path.join(
  __dirname,
  "../src/shared/data/destinations-index.json",
);
const detailsDir = path.join(__dirname, "../public/data/destinations");

if (!fs.existsSync(detailsDir)) {
  fs.mkdirSync(detailsDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

const index = data.map((dest) => {
  // Extract detail fields to save in separate files
  const {
    description,
    gallery,
    highlights,
    budgetBreakdown,
    reservation,
    parking,
    restaurants,
    cafes,
    notes,
    itinerary,
    itineraries,
    ...indexFields
  } = dest;

  // Write detail file
  fs.writeFileSync(
    path.join(detailsDir, `${dest.id}.json`),
    JSON.stringify(dest, null, 2),
  );

  return indexFields;
});

// Write index file
fs.writeFileSync(indexDest, JSON.stringify(index, null, 2));

console.log(`Successfully split ${data.length} destinations.`);
console.log(`Index saved to: ${indexDest}`);
console.log(`Details saved to: ${detailsDir}`);
