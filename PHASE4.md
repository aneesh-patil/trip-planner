# Phase 4: Production Scale & Robustness 🚀

This document outlines the roadmap to transition the application from an "engineered portfolio piece" to a truly production-ready, scalable application. 

## 1. Advanced Data Fetching & Caching (TanStack Query)
Currently, data fetching relies on native `useEffect` hooks and global state. While functional, it lacks caching, retry logic, and built-in loading states.

### Action Items
- **Install Dependencies:** `npm install @tanstack/react-query @tanstack/react-query-devtools`
- **Setup Provider:** Wrap the app in `<QueryClientProvider>` inside `App.tsx` and configure sensible stale-times (e.g., 5 minutes for destination data).
- **Refactor Services:** Create custom query hooks (e.g., `useDestinations()`, `useDestination(id)`, `useWeatherForecast(lat, lng)`) in the `src/shared/hooks` folder.
- **Implement Caching:** Replace `useEffect` fetches in `DestinationDetails.tsx` and `Home.tsx` with these custom hooks.
- **Loading & Error States:** Connect TanStack Query's `isLoading` and `isError` flags directly to our existing `Suspense` and `ErrorBoundary` implementations.

## 2. Real Backend Infrastructure (Cloudflare D1 & Pages Functions)
Our data currently lives in static `.json` files. To support dynamic data (like real user ratings, bookmarks across devices, or CMS-driven destination updates), we need an API.

### Action Items
- **Schema Design:** Design a relational schema using SQLite (Cloudflare D1).
  - `Destinations` (id, name, region, description)
  - `Ratings` (id, destination_id, overall, food, value)
  - `TransportOptions` (id, destination_id, mode, duration)
- **Database Provisioning:** Initialize a Cloudflare D1 Database and run migrations to seed the database with our existing JSON data.
- **API Routes Setup:** Create Cloudflare Pages Functions (`functions/api/destinations/index.ts`, `functions/api/destinations/[id].ts`) to securely query D1.
- **Service Integration:** Update `DestinationService.ts` to execute `fetch('/api/destinations')` instead of importing static JSON.

## 3. End-to-End (E2E) Testing (Playwright)
While Vitest covers our unit logic, we have zero automated guarantees that the UI functions correctly in a browser.

### Action Items
- **Setup:** Run `npm init playwright@latest` to install the framework and configure `playwright.config.ts`.
- **Critical Path Tests:**
  - `home.spec.ts`: Verify the smart planner correctly populates recommendations when sliders and drop-downs are changed.
  - `navigation.spec.ts`: Test routing from Home -> Destination Details -> Map.
  - `compare.spec.ts`: Test that adding destinations to the compare list updates the UI accurately.
- **CI Integration:** Add Playwright to our GitHub Actions workflow so it blocks pull requests if the UI is broken.

## 4. Internationalization (i18n) & Accessibility (a11y)
A tourism application must cater to diverse audiences natively.

### Action Items
- **i18n Setup:** Install `i18next` and `react-i18next`.
- **Dictionary Extraction:** Move hardcoded strings (e.g., "Find your trip in 30s", "What's the vibe?") into `en.json` and create a matching `ja.json` for Japanese.
- **Language Toggle:** Add a language switcher to the `Navbar.tsx` and map text rendering to the `useTranslation()` hook.
- **a11y Audit:** 
  - Add `aria-labels` to icon-only buttons.
  - Ensure all form inputs (`Select`, `Slider`) have programmatic associations.
  - Verify contrast ratios on the dark mode theme.
  - Ensure full keyboard navigation capability (tab focus rings).

---

## Execution Order Recommendation
1. Start with **TanStack Query** (Step 1) as it cleans up existing React logic.
2. Move to **E2E Testing** (Step 3) to lock in existing behaviors.
3. Proceed to **Cloudflare D1 Migration** (Step 2) because the tests will guarantee the backend swap didn't break the UI.
4. Finish with **i18n & a11y** (Step 4) for final polish.
