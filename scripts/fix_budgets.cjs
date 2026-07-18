const fs = require("fs");
const dests = JSON.parse(fs.readFileSync("src/data/destinations.json", "utf8"));

dests.forEach((d) => {
  d.budgetRecommended = Math.round(d.budgetRecommended / 2);
  d.budgetMin = Math.round(d.budgetMin / 2);
  d.budgetMax = Math.round(d.budgetMax / 2);
});

fs.writeFileSync("src/data/destinations.json", JSON.stringify(dests, null, 2));
