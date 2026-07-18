const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) walk(dirPath, callback);
    else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) callback(dirPath);
  });
}

const replacements = [
  { from: /@\/pages\/(Home|Destinations|DestinationDetails|Compare|Favorites|JapanMap)/g, to: (match, p1) => {
      const featureMap = {
        'Home': 'home',
        'Destinations': 'destinations',
        'DestinationDetails': 'destinations',
        'Compare': 'compare',
        'Favorites': 'favorites',
        'JapanMap': 'map'
      };
      return `@/features/${featureMap[p1]}/${p1}`;
  }},
  { from: /@\/components\/layout/g, to: '@/shared/components/layout' },
  { from: /@\/components\/ui/g, to: '@/shared/components/ui' },
  { from: /@\/components\/destinations/g, to: '@/features/destinations/components' },
  { from: /@\/hooks/g, to: '@/shared/hooks' },
  { from: /@\/lib\/utils/g, to: '@/shared/utils/utils' },
  { from: /@\/types/g, to: '@/shared/types' },
  { from: /@\/data\/destinations\.json/g, to: '@/shared/data/destinations-index.json' },
];

walk(path.join(__dirname, '../src'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  // Also replace standard relative imports in App.tsx
  if (filePath.endsWith('App.tsx')) {
    content = content.replace(/\.\/pages\//g, './features/');
    content = content.replace(/\.\/components\/layout\//g, './shared/components/layout/');
    content = content.replace(/\.\/hooks\//g, './shared/hooks/');
    // Specific fixes for App.tsx lazy routes
    content = content.replace(/import\("\.\/features\/DestinationDetails"\)/g, 'import("./features/destinations/DestinationDetails")');
    content = content.replace(/import\("\.\/features\/Compare"\)/g, 'import("./features/compare/Compare")');
    content = content.replace(/import\("\.\/features\/JapanMap"\)/g, 'import("./features/map/JapanMap")');
    content = content.replace(/import Home from "\.\/features\/Home";/g, 'import Home from "./features/home/Home";');
    content = content.replace(/import Destinations from "\.\/features\/Destinations";/g, 'import Destinations from "./features/destinations/Destinations";');
    content = content.replace(/import Favorites from "\.\/features\/Favorites";/g, 'import Favorites from "./features/favorites/Favorites";');
  }

  // Same for index.tsx or main.tsx if there are relative imports
  if (filePath.endsWith('utils.ts') || filePath.includes('BudgetService.ts')) {
      content = content.replace(/@\/types\/destination/g, '@/shared/types/destination');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
});
