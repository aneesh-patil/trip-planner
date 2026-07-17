const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/destinations.json', 'utf-8'));

data.forEach(dest => {
  // Add Budget Breakdown based on budgetRecommended
  const total = dest.budgetRecommended;
  
  // Rough estimations
  let transport = dest.trainAvailable ? 3000 : 5000;
  if (dest.trainTimeMin > 100) transport += 2000;
  if (dest.prefecture === 'Tokyo') transport = 1000;
  
  let tickets = dest.categories.includes('Theme Park') ? 8000 : 
                dest.categories.includes('Museums') || dest.categories.includes('Art') ? 2000 : 
                dest.categories.includes('Onsen') ? 1500 : 0;
                
  let remaining = total - transport - tickets;
  if (remaining < 0) {
    tickets = 0;
    remaining = total - transport;
  }
  
  let food = Math.floor(remaining * 0.7);
  let cafe = remaining - food;
  
  // round to nearest 100
  food = Math.round(food / 100) * 100;
  cafe = Math.round(cafe / 100) * 100;

  dest.budgetBreakdown = {
    transport,
    tickets,
    food,
    cafe
  };

  // Add Comfort Metrics
  dest.comfort = {
    heatTolerance: dest.ratings?.summer || 5, // How well it handles heat (1-10)
    rainFriendly: Math.round(dest.indoorPercent * 10), // How well it handles rain (1-10)
    walkingIntensity: Math.round(dest.walkingMin / 1000) // 1-10 scale
  };
});

fs.writeFileSync('src/data/destinations.json', JSON.stringify(data, null, 2));
console.log('Successfully updated destinations.json with budget breakdowns and comfort metrics.');
