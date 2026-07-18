const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../src/features/destinations/DestinationDetails.tsx",
);
let content = fs.readFileSync(filePath, "utf8");

// Replace top imports
content = content.replace(
  'import { useState, useMemo } from "react";',
  'import { useState, useEffect, useMemo } from "react";',
);
content = content.replace(
  'import { getTransportCost, getAdjustedBudget } from "@/shared/utils/utils";',
  'import { budgetService } from "@/shared/services/budget/BudgetService";',
);
content = content.replace(
  'import { destinationService } from "@/shared/services/destination/DestinationService";',
  'import { destinationService } from "@/shared/services/destination/DestinationService";',
);

// Replace component start to loading check
const targetOldStart = `export default function DestinationDetails() {
  const { id } = useParams();
  const allDestinations = destinationService.getDestinationList() as Destination[];
  const destination = (destinationService.getDestinationList() as Destination[]).find(d => d.id === id);
  const { forecast, loading } = useWeekendWeather(destination?.coordinates?.lat, destination?.coordinates?.lng);`;

const actualStartRegex =
  /export default function DestinationDetails\(\) \{[\s\S]*?const \{ forecast, loading \} = useWeekendWeather\(destination\?\.coordinates\?\.lat, destination\?\.coordinates\?\.lng\);/m;

const newStart = `export default function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [destLoading, setDestLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setDestLoading(true);
      destinationService.getDestination(id).then(dest => {
        setDestination(dest);
        setDestLoading(false);
      });
    }
  }, [id]);

  const { forecast, loading } = useWeekendWeather(destination?.coordinates?.lat, destination?.coordinates?.lng);`;

content = content.replace(actualStartRegex, newStart);

// Handle the "Not Found" case to also include loading check
const notFoundOld = `  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Destination Not Found</h1>`;

const notFoundNew = `  if (destLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-emerald-500 animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Destination Not Found</h1>`;

content = content.replace(notFoundOld, notFoundNew);

// Replace budget calls
content = content.replace(
  /getTransportCost\(/g,
  "budgetService.getTransportCost(",
);
content = content.replace(
  /getAdjustedBudget\(/g,
  "budgetService.getAdjustedBudget(",
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Updated DestinationDetails.tsx");
