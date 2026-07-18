const fs = require('fs');
const path = require('path');

const files = [
  'src/features/compare/Compare.tsx',
  'src/features/destinations/Destinations.tsx',
  'src/features/favorites/Favorites.tsx',
  'src/features/home/Home.tsx',
  'src/features/map/JapanMap.tsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, '../', f);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /import destinationsData from "@\/shared\/data\/destinations-index\.json";/g,
    'import { destinationService } from "@/shared/services/destination/DestinationService";'
  );
  content = content.replace(
    /const allDestinations = destinationsData as Destination\[\];/g,
    'const allDestinations = destinationService.getDestinationList() as Destination[];'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${f}`);
});
