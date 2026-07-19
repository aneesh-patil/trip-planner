# Ponytail Audit — Implementation Plan

Ranked by impact (biggest cut first). Each step is independently shippable.

---

## Step 1 — Delete `src/data/destinations.json` (–7,369 lines)

**Tag:** `delete`

The full `destinations.json` inside `src/data/` is dead weight. The app already uses:
- `src/shared/data/destinations-index.json` — lightweight list (imported by `DestinationService`)
- `public/data/destinations/{id}.json` — 69 individual files fetched on demand

**Actions:**
1. Confirm no file imports `src/data/destinations.json` directly: `grep -r "src/data/destinations" src/`
2. `rm src/data/destinations.json`
3. `rm -rf src/data/` if the directory is now empty
4. Run `npm run build` to confirm nothing breaks

---

## Step 2 — Merge `BudgetService.ts` + `utils.ts` (–~95 lines)

**Tag:** `shrink`

Both files implement identical fare logic (shinkansen, bus, train, car, `getAdjustedBudget`).
This caused a real production bug where one file was fixed and the other wasn't.

**Actions:**
1. Delete `src/shared/utils/utils.ts` transport functions (`getTransportCost`, `getAdjustedBudget`)
2. Keep only `cn()` in `utils.ts` (it's a genuine utility used everywhere)
3. `BudgetService.ts` becomes the single source of truth — export `getTransportCost` and `getAdjustedBudget` as named exports alongside the class, OR flatten to plain functions
4. Update all import sites:
   - `src/features/destinations/Destinations.tsx` → import from `BudgetService`
   - `src/features/destinations/components/DestinationCard.tsx` → import from `BudgetService`
   - `src/features/compare/Compare.tsx` → import from `BudgetService`
5. Run `npm run build && npm run test:run` to confirm

---

## Step 3 — Delete dead feature flags from `appConfig.ts` (–4 lines)

**Tag:** `delete`

`enableCompareRecommendations` and `enableDetailedItineraryView` are both hardcoded `true`
and never read anywhere in the codebase. They add fake flexibility with zero payoff.

**Actions:**
1. Remove the `featureFlags` block from `APP_CONFIG`
2. `grep -rn "featureFlags\|enableCompare\|enableDetailed" src/` to confirm nothing consumes them
3. Run `npm run build`

---

## Step 4 — Flatten `DestinationService` class to functions (–10 lines)

**Tag:** `yagni`

A class with zero state and zero private members is just a namespace.

**Before:**
```ts
class DestinationService {
  public getDestinationList() { ... }
  public async getDestination(id) { ... }
  public async compareDestinations(ids) { ... }
}
export const destinationService = new DestinationService();
```

**After:**
```ts
export function getDestinationList() { ... }
export async function getDestination(id) { ... }
export async function compareDestinations(ids) { ... }
```

**Actions:**
1. Rewrite `DestinationService.ts` as plain exported functions
2. Update all import sites to use named imports instead of `destinationService.method()`
   - `src/features/home/Home.tsx`
   - `src/features/destinations/Destinations.tsx`
   - `src/features/destinations/DestinationDetails.tsx`
   - `src/features/compare/Compare.tsx`
   - `src/features/favorites/Favorites.tsx`
3. Run `npm run build`

---

## Step 5 — Flatten `RecommendationService` class to functions (–8 lines)

**Tag:** `yagni`

Same pattern as above — zero private state, single method called externally.

**Before:**
```ts
class RecommendationService {
  public getRecommendations(destinations, context) { ... }
}
export const recommendationService = new RecommendationService();
```

**After:**
```ts
export function getRecommendations(destinations, context) { ... }
```

**Actions:**
1. Rewrite `RecommendationService.ts` as a plain exported function
2. Update `src/features/home/Home.tsx` import
3. Update `RecommendationService.test.ts` to call function directly
4. Run `npm run build && npm run test:run`

---

## Step 6 — Flatten `WeatherService` class to functions (–10 lines)

**Tag:** `yagni`

The `Map` cache is the only reason this exists as a class — but a module-level
`const cache = new Map()` achieves identical singleton behaviour for free.

**Before:**
```ts
class WeatherService {
  private cache = new Map();
  public getWeatherDescription(code) { ... }
  public async getWeekendWeather(lat, lng) { ... }
}
export const weatherService = new WeatherService();
```

**After:**
```ts
const cache = new Map(); // module-level singleton

export function getWeatherDescription(code) { ... }
export async function getWeekendWeather(lat, lng) { ... }
```

**Actions:**
1. Rewrite `WeatherService.ts` as module-level cache + plain exported functions
2. Update `src/shared/hooks/useWeather.ts` imports
3. Run `npm run build`

---

## Step 7 — Replace `@fontsource-variable/geist` with CDN link (–1 npm dep, –~50KB bundle)

**Tag:** `native`

A font loaded as an npm package bloats the JS bundle. A CDN `<link>` is free, cached by the
browser across sites, and zero bundle impact.

**Actions:**
1. `npm uninstall @fontsource-variable/geist`
2. Remove `import "@fontsource-variable/geist"` from `src/main.tsx` or `src/index.css`
3. Add to `index.html` `<head>`:
   ```html
   <link rel="preconnect" href="https://fonts.bunny.net">
   <link href="https://fonts.bunny.net/css?family=geist:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">
   ```
   Or use Google Fonts if Geist is available there; otherwise Bunny Fonts is a GDPR-compliant mirror.
4. Confirm `font-family: 'Geist Variable'` still resolves in CSS
5. Run `npm run build` and compare bundle sizes

---

## Step 8 — Delete scaffold assets (–3 files)

**Tag:** `delete`

Vite scaffold leftovers never referenced in the app.

**Actions:**
1. `grep -rn "react.svg\|vite.svg" src/` — confirm neither is imported
2. `rm src/assets/react.svg src/assets/vite.svg`
3. Confirm `src/assets/hero.png` is either used or delete it too
4. Run `npm run build`

---

## Execution Order

Steps can be done independently but this order minimises risk:

```
8 (assets, trivial)
→ 3 (dead config, trivial)
→ 1 (dead JSON, trivial)
→ 7 (font, easy)
→ 2 (merge budget logic, medium — highest bug-prevention value)
→ 4 (flatten DestinationService, medium)
→ 5 (flatten RecommendationService, medium)
→ 6 (flatten WeatherService, easy)
```

Run `npm run build && npm run test:run` after each step.

---

## Expected Outcome

| Metric | Before | After |
|---|---|---|
| Lines of code | ~11,400 | ~3,850 |
| Duplicate fare logic | 2 copies | 1 copy |
| npm deps removed | — | 1 (`@fontsource-variable/geist`) |
| Class wrappers | 4 | 0 |
| Dead feature flags | 2 | 0 |
| Bundle size (gzip) | ~350KB | ~300KB |
