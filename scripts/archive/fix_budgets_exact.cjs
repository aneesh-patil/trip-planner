const fs = require("fs");

const excelBudgets = {
  "atami-resort": { min: 14000, max: 17000 },
  "boso-peninsula": { min: 18000, max: 22000 },
  matsumoto: { min: 20000, max: 24000 },
  "hakone-onsen": { min: 12000, max: 16000 },
  "harry-potter-studio": { min: 14000, max: 18000 },
  karuizawa: { min: 18000, max: 22000 },
  "kawagoe-edo": { min: 8000, max: 12000 },
  "utsunomiya-oya": { min: 10000, max: 14000 },
  disneysea: { min: 24000, max: 32000 },
  tsukuba: { min: 14000, max: 18000 },
  "omiya-railway": { min: 8000, max: 12000 },
  joypolis: { min: 12000, max: 16000 },
};

const dests = JSON.parse(fs.readFileSync("src/data/destinations.json", "utf8"));

dests.forEach((d) => {
  if (excelBudgets[d.id]) {
    d.budgetMin = excelBudgets[d.id].min;
    d.budgetMax = excelBudgets[d.id].max;
    d.budgetRecommended = Math.round((d.budgetMin + d.budgetMax) / 2);
  } else {
    // For the original 3 (Kamakura, Nikko, Yokohama) that were halved,
    // we need to restore them to their full per-couple amounts.
    // They were halved, so multiply by 2.
    d.budgetMin = d.budgetMin * 2;
    d.budgetMax = d.budgetMax * 2;
    d.budgetRecommended = d.budgetRecommended * 2;
  }
});

fs.writeFileSync("src/data/destinations.json", JSON.stringify(dests, null, 2));
console.log("Budgets updated successfully!");
