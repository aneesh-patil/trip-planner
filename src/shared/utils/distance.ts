import L from "leaflet";

export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  return L.latLng(lat1, lon1).distanceTo(L.latLng(lat2, lon2)) / 1000;
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
    my_car: Math.round((distanceKm / 50) * 60),
    bus: Math.round((distanceKm / 60) * 60),
    shinkansen:
      hasShinkansen && distanceKm > 60
        ? Math.round((distanceKm / 200) * 60) + 30
        : undefined, // 30 min overhead
  };
}
