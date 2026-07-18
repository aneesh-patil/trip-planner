# Nakayama Day Trips (trip-planner)
**Live URL:** [https://nakayama-day-trips.pages.dev/](https://nakayama-day-trips.pages.dev/)
**A reference file for Gemini (and other AI agents) to understand the project architecture, context, and history.**

## 📖 About
"Nakayama Day Trips" is a React-based Single Page Application (SPA) designed to help a couple plan weekend getaways across Japan. It provides detailed travel logistics, couple-specific budgets, interactive maps, weather forecasts, and destination comparisons.
**Current Scope & Future Expansion:** The app currently focuses on destinations within the **Kanto** and **Chubu** regions. Future updates are planned to expand coverage to **Tohoku, Hokkaido, Kansai, Shikoku, and Kyushu**.

## 🏗️ Architecture & Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS.
- **Routing**: `react-router-dom`.
- **Data**: Static JSON (`src/data/destinations.json`). No database is used.
- **State Management**: Zustand/Context via `useTripStore`. Data (Favorites, Visited, Compare) is persisted exclusively in browser `localStorage`.
- **Device Syncing**: 100% stateless frontend sync. User state is Base64 encoded and appended to the URL as a `?sync=...` query parameter. Opening this link on another device decodes the string and saves it to local storage.
- **Hosting**: Deployed statically via Cloudflare Pages (main URL: `https://nakayama-day-trips.pages.dev/`).
- **Performance**: Routes heavy components (`JapanMap`, `Compare`, `DestinationDetails`) using React `lazy()` and `<Suspense>` for optimal chunking.

## 🚀 Key Project History & Progress (v1.0 → v1.2.8)

**v1.0 - The Foundation**
- Initialized as a basic React SPA.
- Set up core routing (`react-router-dom`) and Tailwind styling.

**v1.1.x - Content & Feature Expansion**
- **Data Explosion**: `destinations.json` grew significantly to include dozens of destinations with rich metadata.
- **Automation Scripts**: A suite of one-off scripts (`geocode.cjs`, `update_unsplash.cjs`, `fix_budgets.cjs`) were created to scrape, format, and enhance destination data automatically.
- **New Features**: Added `DestinationMap.tsx` (using Leaflet) for geospatial visualization and `useWeather.ts` to integrate live weather forecasts via Open-Meteo.
- **State & Cloudflare**: Attempted to implement backend cloud sync with Cloudflare Workers (`v1.1.4 - cloudflare setup`), adding `worker.ts` and `wrangler.jsonc`.

**v1.2.x - De-engineering & Optimization (Current State)**
1. **Stateless Reversion (v1.2.5+)**:
   - Purged the speculative Cloudflare Worker backend logic (`wrangler.jsonc`, `src/worker.ts`) to embrace a fully static, zero-cost architecture.
   - Replaced backend sync with a 100% stateless frontend sync (Base64 encoding state into the URL).
2. **Logistics & Fares Fixes**:
   - Fixed the train fare calculation in `src/lib/utils.ts`. It now accurately computes round-trip couple totals using real JR Tokaido Line reference rates (`time * 34.3`).
   - Added interactive Budget Selectors in the `DestinationDetails` view, allowing the user to select between Train, Shinkansen, Car, and Highway Bus, dynamically recalculating the total "Couple Budget".
   - Integrated Google Maps directions that automatically read the user's current GPS location instead of a hardcoded origin.
3. **UI/UX Refinements**:
   - Implemented responsive mobile navigation (hamburger menu).
   - Removed the `WeatherWidget` from all card grids to prevent 69+ parallel API calls on load. Weather is now dynamically fetched *only* on the `DestinationDetails` page.
   - Removed redundant duplicated fields (`lat`/`lng`) in favor of unified `coordinates` objects.
   - Consolidated one-off scripts into `scripts/` and planning artifacts into `docs/`.

## 🛠️ Developer Rules (For Gemini)
1. **Maintain Static Architecture**: Do not suggest or implement backend databases (Postgres, Firebase, etc.) or Cloudflare Workers unless explicitly requested by the user. The appeal of this app is its zero-cost, stateless architecture.
2. **Cost Accuracy**: The app calculates budgets for a **Couple (Party of 2)**. Any logic related to transport or tickets must explicitly account for this multiplier.
3. **Aesthetics Matter**: The UI uses modern design patterns (Tailwind, Lucide icons, glassmorphism, smooth micro-interactions). Ensure any new components match this premium aesthetic. 
4. **Testing**: Run `npm run build` to verify chunking and TypeScript strictness before deploying via `npx wrangler pages deploy dist`.
