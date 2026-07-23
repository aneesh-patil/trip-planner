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
  // 1. Train (`train`) - 30% rail circuity, 50 km/h commercial speed, station access & transfer penalty
  const railDistance = distanceKm * 1.3;
  const transfers = Math.min(Math.floor(railDistance / 25), 2);
  const trainTime = Math.round(railDistance * 1.2 + 6 + transfers * 6);

  // 2. Car / Driving (`car`, `my_car`) - 30% road circuity, urban vs highway speed tiers
  const roadDistance = distanceKm * 1.3;
  let carTime: number;
  if (distanceKm < 25) {
    carTime = Math.round(roadDistance * 1.5 + 5);
  } else {
    carTime = Math.round(32.5 * 1.5 + (roadDistance - 32.5) * 0.92 + 6);
  }

  // 3. Bus (`bus`) - 35% bus circuity, urban vs expressway bus tiers
  const busDistance = distanceKm * 1.35;
  let busTime: number;
  if (distanceKm < 20) {
    busTime = Math.round(busDistance * 2.2 + 8);
  } else {
    busTime = Math.round(27.0 * 1.8 + (busDistance - 27.0) * 0.65 + 5);
  }

  // 4. Shinkansen (`shinkansen`) - Gated at >= 50 km, 195 km/h avg speed + 25 min gate/transfer overhead
  const shinkansenDistance = distanceKm * 1.22;
  const shinkansenTime =
    hasShinkansen && distanceKm >= 50
      ? Math.round((shinkansenDistance / 195) * 60 + 25)
      : undefined;

  return {
    train: trainTime,
    car: carTime,
    my_car: carTime,
    bus: busTime,
    shinkansen: shinkansenTime,
  };
}
