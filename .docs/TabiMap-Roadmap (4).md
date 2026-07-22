# TabiMap — Product Roadmap & Backlog
_Prepared from a review of the live app and the `trip-planner` repo (main branch, July 2026)_

## Where things actually stand

TabiMap is further along than a typical weekend project. Confirmed in code:

- **Recommendation engine** (`RecommendationService.ts`) — real weighted scoring, not decorative. Pulls live weather (Open-Meteo), computes home-station distance, adjusts for budget/transport/trip-type/season.
- **Budget model** (`BudgetService.ts`) — real inputs: current gas price/L, NEXCO toll rate per km, tiered car rental fees, per-mode Shinkansen pricing. Not placeholder numbers.
- **Cloud sync** (`useTripStore.tsx` + Supabase) — favorites, visited places, visited prefectures, and home station sync to a `user_data` table on login, with local-first fallback via `localStorage`. Logout wipes local state correctly. New-user "no rows yet" case handled.
- **RLS verified** — `user_data` has insert/update/select policies all scoped to `auth.uid() = id`. No delete policy exists yet (see backlog).
- **Auth** — Google, Twitter/X, LINE, and email/password all wired via Supabase Auth.
- **~8,000 stations** geocoded for home-station input; destination dataset is JSON-driven, not hardcoded per-page.

This is a stronger foundation than the UI alone suggests. The backlog below is about hardening and extending it, not building it from scratch.

---

## P0 — Before wider sharing (next sprint)

**Status: ✅ Complete** (commit `5825ec3` — "fix: address P0 roadmap issues")

| Item | Status | Notes |
|---|---|---|
| Add a `DELETE` RLS policy for `user_data` | ⬜ Not yet applied | SQL was drafted (`CREATE POLICY "Users can delete own data" ON user_data FOR DELETE USING (auth.uid() = id);`) — confirm this was actually run in the Supabase Dashboard, since it's a manual step outside the codebase. |
| Debounce Supabase sync writes | ✅ Done | 1s debounce via `setTimeout` + ref, correctly cleared on unmount/re-trigger. |
| Surface sync failures to the user | ✅ Done | `sonner` toast added, fires on upsert error alongside the existing `console.error`. |
| Decide on merge vs. overwrite sync strategy | ✅ Done — **decided as remote-wins, not merge** | On login, remote data fully overwrites local state (not unioned). Simpler than a true merge and avoids a subtle "removed items reappear" bug a naive union would have caused — but means any local changes made before the remote fetch resolves are discarded. Correct tradeoff for solo/casual use; revisit if this ever sees real multi-device concurrent use. |
| Confirm `.env` publishable key is safe long-term | ✅ Confirmed | Anon key + verified RLS (`auth.uid() = id` on insert/update/select) means the public key can't be abused. Re-check whenever a new table is added. |

## P1 — Near-term improvements

**Status: ✅ Complete** (commit `4308408` — "feat: complete P1 roadmap items", after a few honest iterations)

| Item | Status | Notes |
|---|---|---|
| Convert soft penalties to real filters | ✅ Done | Transport mismatches are now excluded via `.filter()` before scoring runs, not buried via `score -= 1000`. Directly fixes the "bad match still appears in results" issue. |
| Normalize the recommendation scoring weights | ✅ Partially done | All magic numbers pulled into a named `SCORING_WEIGHTS` object — genuinely more readable and maintainable. **Note: the actual values are untouched** (same numbers, just named) — relative calibration between trip types (e.g. is `themepark`'s ±30/45 actually comparable to `history`'s ±18/20?) was never validated, just made visible. Fine to leave as a judgment call for later. |
| Clean up the data pipeline | ✅ Done | New `scripts/pipeline.cjs` replaces ~15 one-off `fix_*` scripts (archived, not deleted, in `scripts/archive/`). Does real work: geocodes missing coordinates via Nominatim with rate-limiting and fallback, normalizes `budgetRecommended` to the min/max midpoint, and flags (rather than fakes) missing hero images with a manual-sourcing count. Genuinely repeatable for future regions (F3). |
| Sync `compareList` or explicitly decide it's session-only | ✅ Done | Explicitly decided as local-only (`localStorage`, wiped on logout, not synced to cloud). Documented & handled in `useTripStore.tsx`. |
| Custom domain | ⬜ Not addressed | Separate from code work — `tabimap.com` is taken; `tabimap.app` ($14.20/yr) confirmed available if you want to move off `.pages.dev`. |



## P2 — Nice to have / exploratory

| Item | Why |
|---|---|
| Show *why* a destination scored low, not just why it scored high | `matchReasons` currently only surfaces positive reasons. Showing "excluded because: outside budget by ¥12k" could make the engine feel more transparent/trustworthy. |
| Persist and version the scoring config | If weights are going to be tuned repeatedly, worth pulling them into a single config object (already somewhat true) with a comment explaining the intended relative scale. |
| Multi-day itinerary chaining | Right now it looks like single-destination recommendations/comparisons. A "plan 2 days across these 3 spots" feature would be a meaningful step up from destination discovery to actual itinerary building. |

---

## Feature Roadmap — user-requested items

Decisions below reflect answers already given; items still open are marked.

### F1 — Party size drives calculations (profile default + per-search override)

**Status: ✅ Complete** (commits `a250abc`, `11aa9ee`)

`partySize` now flows correctly end-to-end: saved in `PreferencesModal.tsx` → defaults into `Home.tsx`/`Destinations.tsx` state → per-search stepper override available → threaded into `getAdjustedBudget()` and `DestinationCard`. Cost scaling was done thoughtfully, not naively: per-person costs (transport, other costs) scale linearly with `partySize`, while car costs scale in discrete units (`Math.ceil(partySize / 4)`, assuming ~4 seats per car) rather than a blind multiply — this was the exact open question from the original write-up, resolved correctly.

**Known caveat, not a bug:** `otherCosts` per-person figures are derived by dividing the existing 2-person `budgetRecommended` value by 2 — accurate only insofar as that field was consistently authored as a strict 2-person baseline across all 73 destinations. Worth a spot-check if costs ever look off for larger parties.

### F2 — Transport preferences: car mode + public transport mode, both selectable (supersedes earlier "hide irrelevant option" framing)

**Status: ✅ Complete, including detail-page consistency fix** (commits `a250abc`, `1915cf8`, `0186e5a`, `555e48a`)

Shipped exactly to spec: `carMode` (single-select: My Car / Rental Car / None) and `publicModes` (multi-select: Train / Bus / Shinkansen) as two independent dimensions, not a flat "pick 2 of 5" pool. Destination cards show only the modes matching the active selection, with the cheapest of those highlighted via a visible "Cheapest" badge (also correctly uses `partySize` in its cost calc after a same-day fix).

A gap was found and closed during review: **the Destination Details page's Logistics tab was showing all transport modes regardless of the active filter**, dropping filter context on click-through. Fixed by threading the selection through React Router state (`state={linkState}` on the card's `Link`), with an explicit, deliberate fallback: direct links/bookmarks with no state show all modes (unchanged safe default), while filtered navigation shows only the selected modes. The underlying mode-matching logic was also extracted into a single shared `getValidModes()` function during this fix, removing a prior duplication between the filter and scoring passes in `RecommendationService.ts` — a genuine improvement beyond the immediate ask.

**One remaining item, still open:** the "hide car mode entirely if not applicable" part of the original decision was never implemented at the *preference* level — `DestinationFilters.tsx` still always shows all three car buttons (No Car / Rental / My Car) regardless of any saved profile preference, because no such preference (e.g. "I own a car" / "no car, public transport only") exists yet in `PreferencesModal.tsx`. This is a smaller, separate task:
- [x] Add a car-ownership preference to `PreferencesModal.tsx`, persisted the same way as `partySize`
- [x] Read it in `DestinationFilters.tsx` to conditionally hide irrelevant car buttons
- [x] Default to "show all three" for users who haven't set the preference yet

**Minor, optional polish:** the "Cheapest" badge technically means "cheapest among your selected modes," not cheapest overall — accurate to the spec, but could be worded as "Best of selected" to avoid overclaiming when a cheaper unselected mode exists.

### F3 — Expand beyond Kanto/Chubu (nationwide coverage)

**Decision: longer-term, wants a repeatable pipeline first — not just adding more hand-entered JSON.**

Current state: 73 destinations, all in Kanto/Chubu (Tokyo, Kanagawa, Chiba, Saitama, Ibaraki, Tochigi, Aichi, Gifu, Nagano, Shizuoka). The `/scripts` directory has ~15 one-off `fix_*` scripts suggesting the current data was hand-patched repeatedly rather than generated by one repeatable process.

- [x] Before adding new prefectures, consolidate the existing fix/patch scripts into a single documented pipeline (`scripts/pipeline.cjs` created)
- [ ] Decide a data source strategy: manual curation (as now, just more of it), or semi-automated (e.g. Wikipedia/Wikivoyage scraping + manual review), since this changes how "repeatable" needs to be defined
- [ ] Prioritize regional order — Kansai (Kyoto/Osaka/Nara) is the obvious next block given tourist demand; Tohoku/Kyushu/Hokkaido further out
- **Open question:** should transport-time/cost calculations (currently tuned around Kanto/Chubu day-trip distances) be re-validated once destinations are far enough that overnight stays become the norm rather than day trips? The budget model doesn't currently have an accommodation cost component.

### F4 — External service links/integrations (Yahoo Norikae Annai, Kanabi, etc.)

No existing integration code found in the repo — this is greenfield, not an extension of anything half-built.

- [ ] Simplest version: deep-link out to Yahoo Norikae Annai (or Jorudan/NAVITIME) with origin/destination pre-filled via URL params, opened in a new tab — no API integration needed, just a well-formed link
- **Open questions to resolve before building:**
  - Which service specifically — Yahoo Norikae Annai's URL-param format is straightforward to link into; NAVITIME and Jorudan have similar patterns but different query formats
  - Deep link only, or pull live fare/time data via an API? (Most Japanese transit APIs require registration/approval and may have commercial-use restrictions worth checking given the earlier trademark caution)
  - What is "Kanabi" referring to here — couldn't identify this service by that name; confirm exact name/spelling before scoping

### F5 — More profile settings

**Status: ✅ Implemented** (commit `a250abc`) — added unit preferences and email notification opt-in, matching the candidates suggested above.

> ### ⚠️ Remaining bug: `deleteAccount()` doesn't check for errors before signing out (Fixed: commit `0e9317b`)
> A delete-account action already exists and is reachable in the UI. **The DELETE RLS policy has now been confirmed run in Supabase.**
> - [x] Check the `error` returned from the delete call in `deleteAccount()` and surface a failure (toast, same pattern as the P0 sync-failure toast) instead of always proceeding to sign out regardless of outcome

### F6 — Share a place (single destination first, itinerary/list sharing later)

**Status: ✅ Complete** (commit `276c24b`)

- [x] Add a share action on `DestinationDetails.tsx` — generate a URL that deep-links directly to that destination's detail view
- [x] Decide share mechanism: native Web Share API (mobile-friendly, one tap) vs. simple "copy link" button — recommend both, Web Share API with copy-link fallback for desktop
- [ ] Later phase (not now): sharing a comparison list or saved itinerary — would need a way to serialize `compareList`/`favorites` into a shareable, possibly read-only state, which is a bigger design question than single-destination linking

### F7 — Feedback and contact

**Status: ✅ Complete** (commit `a250abc`) — simple `mailto:` link added to the footer, matching the "simplest version" recommendation exactly. No further action needed unless you later want submissions tracked somewhere queryable.

### F8 — Flights as a transport mode

**Decision: tie to geographic expansion, low priority until then.** Flights don't make sense for Kanto/Chubu day trips; revisit once destinations reach Kyushu/Hokkaido/Okinawa where flights become genuinely competitive with rail.

- [ ] Park until F3 (geographic expansion) reaches a region where flight time/cost would actually beat Shinkansen — no action needed now

### F9 — "Skyscanner for destinations" — broader search/discovery

The request is fairly open-ended — worth narrowing before scoping into tasks.

- **Open questions:**
  - Is this about search UX (faster/fuzzier text search across destinations, filters, autocomplete) or about the discovery model itself (e.g. "surprise me" / flexible-dates-style browsing)?
  - Skyscanner's core value is comparing across many providers for the same route — is the TabiMap equivalent "compare many destinations for the same constraints" (which the app already does via scoring + Compare), or something else you have in mind specifically?
  - Recommend treating this as a discussion item next planning session rather than a backlog line, since "more like Skyscanner" could mean several different concrete features depending on which part of Skyscanner you mean

### F10 — Japanese language support (full UI translation)

**Decision: full UI translation** — every screen, button, and label, not just partial or search-only support.

**Reality check: zero i18n scaffolding exists in the codebase today.** No translation library, no locale files, no string extraction — every UI string is hardcoded English inline in components (e.g. `"Find My Match"`, `"Max Budget (couple)"`, category/tag labels like `"Onsen"`, `"Nature"`). This is a substantial, multi-part effort, not a toggle:

- [ ] Pick an i18n library (`react-i18next` is the standard React choice) and set up the provider/config
- [ ] **Extract every hardcoded UI string** across all components into translation keys — this alone touches nearly every `.tsx` file in `src/features` and `src/shared/components`
- [ ] Translate destination **content**, not just UI chrome — `name`, `categories`, `tags`, and any descriptive text in the 73-destination dataset are currently English-only (e.g. `"Onsen"`, `"Romantic"`, `"Relaxing"`). Decide: translate all 73 now, or build the i18n system first and backfill content translations over time
- [ ] Add a language switcher in profile/settings, persist the choice (localStorage + synced preference, same pattern as `partySize`)
- [ ] Decide on locale-aware number/currency formatting (¥ already used throughout — confirm formatting conventions match Japanese norms, e.g. `¥19,200` vs `19,200円`)
- **Sequencing note:** this is a good candidate to tackle *before* F3 (geographic expansion) rather than after, since every new destination added post-i18n needs translation twice if done in the wrong order — cheaper to build the translation pipeline once, then add regions through it.

### F11 — Roulette (random pick, respecting active filters)

**Decision: random, but constrained by whatever filters are currently active** (budget/transport/weather/trip type) — not fully random across all 73 destinations.

No existing random-selection logic in the codebase — straightforward to build on top of what exists:

- [ ] Add a "Surprise Me" / roulette button on the main page, likely near "Find My Match"
- [ ] Implementation: reuse the existing `getRecommendations()` filtering/scoring pass (same inputs: `tripType`, `budget`, `transport`, `weather`), but instead of taking the top-N by score, pick randomly from destinations that pass the *hard* exclusions (budget range, transport availability) — recommend not requiring a high match score, since the point of roulette is discovering something you wouldn't have picked, not re-surfacing the top match
- [ ] Decide whether "already visited" places should be excluded from roulette results (recommend yes, consistent with how they're excluded from regular recommendations)
- [ ] Small UX detail worth deciding: single result, or a short animated "spin" through a few candidates before landing (the latter is more fun but purely cosmetic — fine to skip for v1)

### F12 — Long-term: LLM-powered natural language search

**Decision: natural language search** (e.g. "somewhere quiet and cheap near Tokyo") rather than LLM-written content or a full conversational assistant. This is explicitly long-term/exploratory, not near-term backlog — noting the shape of it now so it's not forgotten, not because it's ready to scope into sprints.

- **Open questions to resolve much closer to actually building this:**
  - Where does the LLM call happen — client-side (would expose an API key, not viable) or a small backend/edge function (needed either way, and would be the first server-side compute this app has beyond Supabase)?
  - Does natural language search *replace* the current filter UI, or sit alongside it as an alternative entry point? (Recommend alongside — the sliders/dropdowns already work well and give predictable, explainable results; natural language is an additive convenience, not a replacement for the transparent scoring engine that's a real strength of the app today)
  - Translation of the free-text query into the existing structured filters (`tripType`, `budget`, `transport`, `weather`) is the actual core task — this is closer to "LLM as a parser into the existing `RecommendationContext` shape" than "LLM picks the destination directly," which keeps the trustworthy, explainable scoring logic intact rather than replacing it with an opaque model call
  - Cost/rate-limiting considerations once this involves paid API calls per search, unlike everything else in the app today

### F13 — Multi-day trip support

**Decision: starting point is combining destinations you already like (favorites/compare list) into a day-by-day plan** — not a from-scratch "tell me # of days, build the whole trip" generator. Whether it needs strict day-by-day assignment (Day 1: X, Y / Day 2: Z) vs. just grouping places into one saved trip is still open — flagged below since it changes the scope significantly.

**Reality check:** no multi-destination or multi-day concept exists anywhere in the codebase today. The only "itinerary" concept that exists is `DestinationDetails.tsx`'s "Sample Itinerary" tab — a single-destination, single-day, hour-by-hour plan (e.g. "9am: arrive, 11am: lunch" for one place). This is genuinely new — not an extension of that feature, though the data shape (`ItineraryStep[]`) may be reusable for structuring day content once places are grouped.

- [ ] **Resolve the open question first:** does v1 need actual day assignment (place X on Day 1, place Y on Day 2), or is "save these 4 favorited places as one named trip, unordered" enough to ship first? Recommend the simpler unordered version as v1 — it's a fraction of the work and validates whether people actually use the feature before building day-by-day scheduling on top of it
- [ ] New data shape needed: a "Trip" (or "Plan") entity — likely a new Supabase table (`trips`), separate from `user_data`, since a user will eventually want multiple saved trips, not one blob. Needs its own RLS policies (same `auth.uid()` pattern as `user_data`) from day one, not bolted on after
- [ ] UI entry point: likely an action from the existing `Compare` view ("Save these as a trip") or `Favorites` view, since that's the natural place someone already has multiple places they're deciding between
- [ ] **If/when day-by-day assignment is added later:** decide whether the app auto-suggests a day grouping (e.g. based on geographic proximity between selected destinations, using the same `getDistance()` utility already used for home-station distance) or the user manually drags/assigns places to days — auto-suggestion is more work but is the actual "planner" value; manual assignment is closer to a simple checklist
- [ ] Multi-day trips raise the accommodation-cost question already flagged under F3 (geographic expansion) — worth solving once, not twice, since both features hit the same gap: `BudgetService.ts` has no lodging cost component today, and a multi-day trip without one will under-quote the real cost significantly
- **Sequencing note:** this pairs naturally with F6 (share a place) — a saved multi-day trip is the more compelling thing to actually share with someone than a single destination, so F6's "share itinerary" phase (currently deferred) may end up arriving alongside this rather than long after

### F14 — Four-tier budget system (Budget / Balanced / Comfortable / Luxury), shown as ranges

**Decision: replace the single budget slider/figure with four named tiers, each displaying a ¥ range rather than one number.** Tier names: **Budget → Balanced → Comfortable → Luxury**.

Current state: `Home.tsx` uses a single continuous slider (¥0–¥100,000+) that outputs one number, compared against `budgetRecommended` in `RecommendationService.ts`. Every destination already carries `budgetMin` / `budgetRecommended` / `budgetMax` in its data (confirmed in `destinations-index.json` — e.g. Hakone: min ¥16,200 / recommended ¥19,200 / max ¥24,200), so the underlying range data already exists — this is substantially a UI and scoring-logic change, not a full data re-entry task.

- [ ] Replace the budget slider with a 4-option tier selector (segmented control or similar, same visual weight as the trip-type buttons)
- [ ] **Open question to resolve before building:** how do tier ranges map onto each destination's existing `budgetMin`/`budgetRecommended`/`budgetMax`? Two paths:
  - **Formula-based**: derive all 4 tiers from the existing 3 values with fixed multipliers (e.g. Budget = `budgetMin`, Balanced = `budgetRecommended`, Comfortable = `budgetRecommended × 1.3`, Luxury = `budgetMax × 1.5`+) — fast to ship, works immediately across all 73 destinations, but tier boundaries may feel arbitrary or inconsistent between very cheap and very expensive destinations
  - **Authored per destination**: each destination gets 4 explicit hand-set ranges — more accurate (a ¥50k "Luxury" day trip to Hakone and a ¥50k "Luxury" day trip to a free hiking spot mean very different things), but is real data-entry work across all 73 entries, and needs to be repeated for every future destination added under F3
  - Recommend starting formula-based to ship quickly, then spot-checking whether any destinations feel obviously wrong and hand-overriding just those, rather than committing to full manual authoring up front
- [ ] Update `RecommendationService.ts`'s budget-scoring block to compare against a tier range rather than a single adjusted-budget number
- [ ] Update all budget displays across the app (destination cards, `DestinationDetails.tsx`, `Compare.tsx`) to show a range (e.g. "¥16k–19k") instead of one estimated figure, consistent with the new tier model
- [ ] Confirm how this interacts with F1 (party size) — tier ranges are presumably per-couple/per-party-size baselines, so the same scaling question from F1 applies here too: does a tier range scale linearly with party size, or do some components (e.g. fixed entrance fees) not scale the same way transport does?

---

## Explicitly out of scope (per your call)

- **Monetization** — not a goal right now, so no backlog items here for payments, ads, or premium tiers.
- **Trademark/naming** — "TabiMap" overlaps with an existing Japanese company name and a similar iOS app, but since this stays personal/non-commercial, no action needed unless that changes.
