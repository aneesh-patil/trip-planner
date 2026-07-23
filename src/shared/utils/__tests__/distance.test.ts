import { describe, it, expect } from "vitest";
import { getDynamicTransportOptions } from "../distance";

describe("getDynamicTransportOptions - Realistic Japan Travel Estimates", () => {
  it("calculates realistic train travel times across short, medium, and long distances", () => {
    // 1. Tokyo -> Shinjuku (6.2 km)
    const shortTrip = getDynamicTransportOptions(6.2);
    expect(shortTrip.train).toBe(16);

    // 2. Nakayama -> Yokohama (11.2 km)
    const commuterTrip = getDynamicTransportOptions(11.2);
    expect(commuterTrip.train).toBe(23);

    // 3. Osaka -> Nara (28.0 km)
    const regionalTrip = getDynamicTransportOptions(28.0);
    expect(regionalTrip.train).toBe(56);

    // 4. Nakayama -> Saitama Railway Museum (45.8 km)
    const crossPrefecture = getDynamicTransportOptions(45.8);
    expect(crossPrefecture.train).toBe(89);

    // 5. Tokyo -> Kamakura (43.0 km)
    const coastalTrip = getDynamicTransportOptions(43.0);
    expect(coastalTrip.train).toBe(85);

    // 6. Tokyo -> Hakone (80.0 km)
    const longTrain = getDynamicTransportOptions(80.0);
    expect(longTrain.train).toBe(143);
  });

  it("calculates realistic car travel times for urban and highway routes", () => {
    // 7. Shibuya -> Roppongi (4.1 km - Urban)
    const urbanCar = getDynamicTransportOptions(4.1);
    expect(urbanCar.car).toBe(13);

    // 8. Tokyo -> Yokohama (28.0 km - Highway)
    const highwayCar = getDynamicTransportOptions(28.0);
    expect(highwayCar.car).toBe(58);
  });

  it("calculates realistic bus travel times for city buses and inter-city express buses", () => {
    // 9. Kyoto Station -> Arashiyama (9.8 km - City Bus)
    const cityBus = getDynamicTransportOptions(9.8);
    expect(cityBus.bus).toBe(37);

    // 10. Takayama -> Shirakawa-go (32.0 km - Expressway Bus)
    const expressBus = getDynamicTransportOptions(32.0);
    expect(expressBus.bus).toBe(64);
  });

  it("applies distance gating for Shinkansen transit", () => {
    // 11. Tokyo -> Yokohama (28.0 km < 50 km gate)
    const gatedShinkansen = getDynamicTransportOptions(28.0, true);
    expect(gatedShinkansen.shinkansen).toBeUndefined();

    // 12. Tokyo -> Kyoto (370.0 km >= 50 km gate)
    const longShinkansen = getDynamicTransportOptions(370.0, true);
    expect(longShinkansen.shinkansen).toBe(164);
  });
});
