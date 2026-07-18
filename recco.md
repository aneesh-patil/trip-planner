# Code Review — Japan Weekend Planner

Reviewed: 2026-07-18 · Scope: full `src/` tree, config, root scripts

---

## 1. Architecture & Structure

### ✅ What's Working Well
- Clean page/component separation with a flat `pages/` → `components/` → `hooks/` → `lib/` hierarchy.
- `useTripStore` context pattern is simple and appropriate for this app size.
- `useLocalStorage` hook is correct and compact.
- Transport cost model in `lib/utils.ts` is well-structured with real-world rates.
- Type definitions in `types/destination.ts` are thorough.

### ⚠️ Concerns

**Duplicate `coordinates` vs top-level `lat`/`lng`**
The `Destination` type has both `coordinates?: { lat, lng }` (line 55) and standalone `lat`/`lng` (lines 84–85). Different pages use different fields:
- `DestinationMap.tsx`, `JapanMap.tsx` → `dest.coordinates`
- `DestinationDetails.tsx` → `dest.lat` / `dest.lng` (line 24: `destination?.lat`)

This is a latent bug. If one is populated and the other isn't, the weather or map breaks silently. **Pick one. Delete the other. Migrate the JSON.**

**No lazy loading / code splitting**
All 6 pages are eagerly imported in `App.tsx`. The production bundle is 825KB (gzipped 230KB). The map pages pull in the entire Leaflet library even when the user never visits `/map`. Use `React.lazy()` for at least `JapanMap`, `Compare`, and `DestinationDetails`.

---

## 2. Data

**`destinations.json` is 220KB for 69 entries**
This is bundled into the main JS chunk. Every field (itineraries, galleries, restaurants, cafes, highlights) ships on first page load even though most fields are only needed on the detail page. Consider splitting the JSON: a lightweight index (id, name, region, ratings, coordinates, transport, heroImage, tags) for list/card views, and per-destination detail files loaded on demand.

---

## 3. Performance

**`WeatherWidget` fires 69 parallel API calls**
Each `DestinationCard` renders a `WeatherWidget` that makes its own `fetch()` to Open-Meteo on mount. On the `/destinations` grid page, this fires up to 69 concurrent HTTP requests the moment the page loads. Open-Meteo will throttle you. Fix: batch coordinates into a single API call, or cache results by rounded lat/lng, or remove the widget from the card grid and keep it only on the detail page.

**Scoring algorithm runs on every render**
`Home.tsx` line 69: `scoredDestinations` depends on `currentSituation`, which is an object that React will always see as a new reference after state updates. This means the entire scoring loop (69 destinations × complex math) re-runs more often than necessary. Use a stable dependency (e.g., `currentSituation?.temp` and `currentSituation?.desc` individually) or memoize the situation object.

**`divIcon` created inside render loop**
Both `JapanMap.tsx` and `DestinationMap.tsx` call `L.divIcon()` inside `.map()` on every render. Leaflet `divIcon` objects are not cheap. Memoize or cache them by destination id.

---

## 4. Dead Code & Unused Exports

| Item | Location | Issue |
|------|----------|-------|
| `dropdown-menu.tsx` | `src/components/ui/` | 269 lines, **zero imports** anywhere in the app. Delete the file. |
| `CardTitle`, `CardDescription` | `card.tsx` exports | Exported but never imported by any consumer. |
| `TableFooter`, `TableCaption` | `table.tsx` exports | Exported but never imported by any consumer. |
| Empty `src/utils/` directory | `src/utils/` | Contains nothing. Delete it. |
| `Destinations.tsx` line 2 | blank line after removed `Fuse` import | Leftover empty line. |
| `useTripStore.tsx` lines 84–85 | two blank lines | Leftover from removed cloud sync code. |

---

## 5. Root-Level Script Sprawl

There are **10 one-off data scripts** sitting in the project root:

```
add_coords.cjs          fix_budgets.cjs       geocode.cjs
apply_local_images.cjs  fix_budgets_exact.cjs  update_data.js
download_wiki_images.cjs  fix_images.js        update_destinations.js
update_precise_data.cjs   update_unsplash.cjs
```

These are data maintenance scripts that were run once to build `destinations.json`. They clutter the root and confuse anyone cloning the repo. Move them all to a `scripts/` directory (or delete them if the data is stable).

Also: `plan-new.md`, `fare.md`, and `Japan_Weekend_Trip_Planner.html` are planning/research artifacts. Move to a `docs/` folder or remove.

---

## 6. Bugs & Logic Issues

**Operator precedence bug in Home.tsx line 200**
```ts
if (!isRaining && !isHot && weather === "any") {
```
`&&` binds tighter than `===` in human reading, but this actually works in JS because `&&` has lower precedence than `===`. However, the *intent* is ambiguous: does "not raining AND not hot AND weather is any" mean the user hasn't overridden weather? The logic applies a photography bonus on clear days but only when weather is "any"—this seems correct but should be wrapped in parens for clarity:
```ts
if (!isRaining && !isHot && (weather === "any")) {
```

**Compare page `getMin`/`getMax` helpers shadow `Math.min`/`Math.max`**
`Compare.tsx` lines 41–42 define `getMin` and `getMax` that are literally `Math.min`/`Math.max`. They add nothing—just use the builtins directly.

**No error boundary**
If `destinations.json` fails to parse or a weather API returns unexpected shape, the entire app crashes with a white screen. Add a React error boundary at minimum around `<Routes>`.

**`DestinationCard` compare limit alert**
Line 166: uses `alert()` which is a UX anti-pattern. Replace with a toast or inline message.

---

## 7. Mobile / Responsive

**Navbar has no mobile menu**
The nav links are `hidden md:flex`, meaning on mobile there's no way to navigate to Compare, Favorites, Full Map, or Destinations. Users can only reach the home page. This is a critical gap—add a hamburger menu or bottom tab bar.

---

## 8. SEO & Accessibility

- `index.html` has no `<meta name="description">` tag.
- No page-level `<title>` management—every route shows "Nakayama Day Trips". Use `document.title` or a helmet equivalent per page.
- Map marker buttons in `JapanMap.tsx` lack `aria-label`s.
- Image `<img>` tags in hero sections and cards lack explicit `width`/`height`, causing layout shift (CLS).
- The `.node-version` and `.nvmrc` files both exist and both say the same thing. Keep one.

---

## 9. Type Safety

- `WeatherWidget.tsx` line 10: `useState<any>(null)` — type the weather response shape.
- `DestinationDetails.tsx` line 348: `icon: any` in `RatingItem` props — use `LucideIcon` from lucide-react.
- `card.tsx` uses legacy `React.forwardRef` pattern. With React 19 (which this project uses), `ref` is a regular prop. These can be simplified to plain function components.

---

## 10. Config & Build

- `components.json` references `shadcn` config but `shadcn` was removed as a dependency. This file is now orphaned—delete it.
- `.oxlintrc.json` exists but `oxlint` is a devDependency that isn't wired to any CI or pre-commit hook. Either integrate it or remove the config + dependency.
- `tailwind.config.js` has content paths for `./pages/**`, `./components/**`, `./app/**` which don't exist at the root level. Only `./src/**` is needed.
- `postcss.config.js` is present but could be inlined into `vite.config.ts`.
- `netlify.toml` exists alongside `wrangler.jsonc` (now deleted). Confirm which platform you deploy to and clean up.

---

## Priority Ranking

| Priority | Item | Impact |
|----------|------|--------|
| 🔴 P0 | Add mobile navigation | Users on phones can't navigate |
| 🔴 P0 | Fix WeatherWidget N+1 API calls | 69 parallel fetches, rate limiting |
| 🟡 P1 | Deduplicate `coordinates` vs `lat`/`lng` | Latent data bug |
| 🟡 P1 | Lazy load heavy pages (map, details) | 825KB bundle → could halve initial load |
| 🟡 P1 | Delete `dropdown-menu.tsx` (269 unused lines) | Dead code |
| 🟡 P1 | Move root scripts to `scripts/` | Repo hygiene |
| 🟢 P2 | Split `destinations.json` (index + details) | Performance on slow connections |
| 🟢 P2 | Add React error boundary | Crash resilience |
| 🟢 P2 | Add page titles / meta descriptions | SEO |
| 🟢 P2 | Delete orphaned `components.json` | Cleanup |
| 🟢 P2 | Fix `any` types in WeatherWidget & RatingItem | Type safety |
| ⚪ P3 | Remove `getMin`/`getMax` wrappers in Compare | Minor cleanup |
| ⚪ P3 | Clean up leftover blank lines | Polish |
| ⚪ P3 | Trim Tailwind content paths | Config accuracy |
