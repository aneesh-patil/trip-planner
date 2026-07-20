export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getDynamicTransportOptions(
  distanceKm: number,
  hasShinkansen: boolean = false,
) {
  // Rough estimates for Japan
  // Train avg 60 km/h
  // Car avg 50 km/h (including non-highway)
  // Bus avg 60 km/h
  // Shinkansen avg 200 km/h (only if location has Shinkansen access and distance > 60km)
  return {
    train: Math.round((distanceKm / 60) * 60),
    car: Math.round((distanceKm / 50) * 60),
    bus: Math.round((distanceKm / 60) * 60),
    shinkansen:
      hasShinkansen && distanceKm > 60
        ? Math.round((distanceKm / 200) * 60) + 30
        : undefined, // 30 min overhead
  };
}
