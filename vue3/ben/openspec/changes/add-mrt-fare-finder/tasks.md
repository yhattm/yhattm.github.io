# Tasks: Add Taipei MRT Fare Finder Tool

This document outlines the implementation tasks for adding the MRT Fare Finder feature. Tasks are ordered to enable incremental delivery and testing.

## Phase 1: Data Foundation

### Task 1.1: Create MRT Station Data File
**Duration**: 2-3 hours

- [ ] Research official Taipei MRT station list (all operational lines)
- [ ] Create `src/data/mrt-stations.json` file
- [ ] For each station, collect:
  - Station ID (e.g., "BL12", "R10")
  - English name (official Taipei MRT naming)
  - Traditional Chinese name (台北車站, etc.)
  - Latitude and longitude (WGS84 format)
  - Line code (BL, BR, R, G, O, Y)
  - Line color hex code
- [ ] Verify coordinates accuracy using Google Maps or OpenStreetMap
- [ ] Ensure all currently operational stations are included (100+ stations)

**Validation**: Station data loads successfully, coordinates are accurate within 50m

**Dependencies**: None

---

### Task 1.2: Create MRT Fare Matrix Data File
**Duration**: 2-3 hours

- [ ] Research official Taipei MRT fare chart
- [ ] Create `src/data/mrt-fares.json` file
- [ ] Generate fare entries for all station pairs
- [ ] Format as `"stationId1-stationId2": fare_in_NT$`
- [ ] Consider using a script to generate fare matrix (based on distance/zones if pattern exists)
- [ ] Verify fare accuracy against official sources
- [ ] Handle bidirectional lookup (A-B same as B-A)

**Validation**: Fare data includes all station pairs, values match official fares

**Dependencies**: Task 1.1 (need station IDs)

---

### Task 1.3: Define TypeScript Types for MRT Data
**Duration**: 30 minutes

- [ ] Create `src/types/mrt.ts` file
- [ ] Define `Station` interface with all required fields
- [ ] Define `FareMatrix` type as `Record<string, number>`
- [ ] Export types for use throughout the application
- [ ] Add JSDoc comments for documentation

**Validation**: TypeScript compilation succeeds with strict mode

**Dependencies**: Task 1.1, Task 1.2

---

### Task 1.4: Implement Fare Calculation Function
**Duration**: 1 hour

- [ ] Create `src/utils/fare-calculator.ts` file
- [ ] Implement `calculateFare(originId: string, destId: string, fares: FareMatrix): number | null`
- [ ] Handle same-station case (return 0)
- [ ] Check both `"A-B"` and `"B-A"` keys for bidirectional lookup
- [ ] Return `null` if fare not found
- [ ] Write unit tests for fare calculation logic:
  - Same station returns 0
  - Valid fare lookup returns correct value
  - Bidirectional lookup works
  - Missing fare returns null

**Validation**: All unit tests pass, O(1) performance

**Dependencies**: Task 1.2, Task 1.3

---

## Phase 2: Map Integration

### Task 2.1: Install Leaflet.js and Dependencies
**Duration**: 15 minutes

- [ ] Run `npm install leaflet`
- [ ] Run `npm install -D @types/leaflet`
- [ ] Import Leaflet CSS in `main.ts` or component: `import 'leaflet/dist/leaflet.css'`
- [ ] Verify Leaflet is available in the project

**Validation**: Leaflet imports without errors, TypeScript types are recognized

**Dependencies**: None

---

### Task 2.2: Create Map Component
**Duration**: 2-3 hours

- [ ] Create `src/components/mrt/MrtMap.vue` component
- [ ] Set up component props: `stations: Station[]`, `selectedOrigin: string | null`, `fares: FareMatrix`
- [ ] Create map container div with ref and appropriate height
- [ ] Implement `onMounted` lifecycle hook to initialize Leaflet map
- [ ] Set initial center to Taipei Main Station (25.0478, 121.5170)
- [ ] Set initial zoom to 11-12 (show entire MRT network)
- [ ] Add OpenStreetMap tile layer with proper attribution
- [ ] Implement `onUnmounted` lifecycle hook to destroy map and clean up
- [ ] Add basic CSS for map container (full width, minimum height 500px)

**Validation**: Map displays OpenStreetMap tiles, centered on Taipei, zoom/pan works

**Dependencies**: Task 2.1

---

### Task 2.3: Render Station Markers on Map
**Duration**: 2-3 hours

- [ ] In MrtMap component, watch `stations` prop
- [ ] When stations load, create a marker for each station using `L.circleMarker()`
- [ ] Position markers at station lat/lng coordinates
- [ ] Style markers with line color from station data
- [ ] Add station name label using Leaflet tooltip or DivIcon
- [ ] Store marker references for later updates
- [ ] Ensure markers are visible and correctly positioned

**Validation**: All MRT stations appear as markers on the map with correct positions and colors

**Dependencies**: Task 1.1, Task 2.2

---

### Task 2.4: Implement Marker Click to Select Origin
**Duration**: 1-2 hours

- [ ] Add click event listener to each station marker
- [ ] On marker click, emit `select-origin` event with station ID
- [ ] Update parent component to handle origin selection
- [ ] Update marker styles based on selected origin:
  - Origin marker: distinct style (larger, different icon, or star)
  - Destination markers: default style
- [ ] Ensure smooth visual transition when origin changes

**Validation**: Clicking a marker selects it as origin, visual feedback is clear

**Dependencies**: Task 2.3

---

### Task 2.5: Display Fares on Destination Markers
**Duration**: 2 hours

- [ ] Watch `selectedOrigin` prop in MrtMap component
- [ ] When origin is selected, calculate fare for each destination using `calculateFare()`
- [ ] Update marker labels to include fare: "Station Name\nNT$20"
- [ ] Origin marker should display "Origin" or station name only (no fare)
- [ ] If fare is null/missing, display "N/A"
- [ ] Ensure fare labels are legible and well-positioned
- [ ] Update labels immediately when origin changes (no lag)

**Validation**: Selecting origin shows fares on all other station markers, updates are instant

**Dependencies**: Task 1.4, Task 2.4

---

## Phase 3: User Interface

### Task 3.1: Create MRT Fare Finder View Component
**Duration**: 1-2 hours

- [ ] Create `src/views/MrtFareFinderView.vue` component
- [ ] Set up basic page layout with header and main content area
- [ ] Add page title using i18n: "MRT Fare Finder" / "捷運票價查詢"
- [ ] Add subtitle or description text
- [ ] Create container for station selector (to be added in next task)
- [ ] Create container for map component
- [ ] Import and use MrtMap component
- [ ] Apply responsive layout (grid or flex)

**Validation**: Page renders with placeholder content, layout is responsive

**Dependencies**: Task 2.2

---

### Task 3.2: Create Station Selector Component
**Duration**: 2 hours

- [ ] Create `src/components/mrt/StationSelector.vue` component
- [ ] Accept `stations: Station[]` and `selectedOrigin: string | null` as props
- [ ] Use shadcn-vue Select component for dropdown
- [ ] Populate dropdown with station names (English or Chinese based on i18n)
- [ ] Sort stations alphabetically by name in current language
- [ ] Add placeholder text: "Select origin station" / "選擇起點站"
- [ ] Emit `select-origin` event when user selects a station
- [ ] Sync dropdown value with `selectedOrigin` prop
- [ ] Style using Tailwind CSS and shadcn-vue design system

**Validation**: Dropdown shows all stations, selecting a station emits event, works in both languages

**Dependencies**: Task 1.1, Task 3.1

---

### Task 3.3: Integrate Station Selector and Map
**Duration**: 1 hour

- [ ] In MrtFareFinderView, add reactive state for `selectedOrigin: Ref<string | null>`
- [ ] Pass `selectedOrigin` to both StationSelector and MrtMap components
- [ ] Handle `select-origin` event from both StationSelector and MrtMap
- [ ] Update `selectedOrigin` state when either component emits the event
- [ ] Ensure both components stay in sync (selecting in dropdown updates map, clicking map updates dropdown)

**Validation**: Selecting origin from dropdown or map updates both components consistently

**Dependencies**: Task 3.2, Task 2.4

---

### Task 3.4: Add Data Loading and Error Handling
**Duration**: 1-2 hours

- [ ] In MrtFareFinderView, implement `onMounted` to load station and fare data
- [ ] Use dynamic import: `import stationsData from '@/data/mrt-stations.json'`
- [ ] Use dynamic import: `import faresData from '@/data/mrt-fares.json'`
- [ ] Add loading state: `isLoading: Ref<boolean>`
- [ ] Display loading spinner (shadcn-vue Spinner or skeleton) while data loads
- [ ] Add error state: `errorMessage: Ref<string | null>`
- [ ] Catch and handle data loading errors
- [ ] Display user-friendly error message if data fails to load
- [ ] Validate loaded data structure (check for required fields)

**Validation**: Loading indicator appears during data load, errors are handled gracefully

**Dependencies**: Task 1.1, Task 1.2, Task 3.1

---

## Phase 4: Internationalization

### Task 4.1: Add Navigation Menu Item for MRT Fare Finder
**Duration**: 30 minutes

- [ ] Add new route in `src/router/index.ts`:
  - Path: `/mrt-fare-finder`
  - Name: `mrt-fare-finder`
  - Component: lazy-loaded MrtFareFinderView
- [ ] Update `src/components/NavigationMenu.vue` to include new menu item
- [ ] Add active state styling for MRT Fare Finder route
- [ ] Use i18n for menu item text

**Validation**: MRT Fare Finder appears in navigation, clicking navigates to the page, active state works

**Dependencies**: Task 3.1

---

### Task 4.2: Add Translation Keys for MRT Fare Finder
**Duration**: 1 hour

- [ ] Add English translations in `src/locales/en.json`:
  - `nav.mrtFareFinder`: "MRT Fare Finder"
  - `mrtFareFinder.title`: "Taipei MRT Fare Finder"
  - `mrtFareFinder.subtitle`: "Select a starting station to see fares to all destinations"
  - `mrtFareFinder.selectOrigin`: "Select origin station"
  - `mrtFareFinder.origin`: "Origin"
  - `mrtFareFinder.loading`: "Loading MRT data..."
  - `mrtFareFinder.error`: "Failed to load MRT data. Please refresh the page."
  - `mrtFareFinder.noFare`: "N/A"
- [ ] Add Traditional Chinese translations in `src/locales/zh.json`:
  - `nav.mrtFareFinder`: "捷運票價查詢"
  - `mrtFareFinder.title`: "台北捷運票價查詢"
  - `mrtFareFinder.subtitle`: "選擇起點站即可查看到所有站點的票價"
  - `mrtFareFinder.selectOrigin`: "選擇起點站"
  - `mrtFareFinder.origin`: "起點"
  - `mrtFareFinder.loading`: "載入捷運資料中..."
  - `mrtFareFinder.error`: "載入捷運資料失敗，請重新整理頁面。"
  - `mrtFareFinder.noFare`: "無資料"
- [ ] Use translations in all MRT-related components

**Validation**: All UI text displays correctly in both English and Chinese, language switching works

**Dependencies**: Task 3.1, Task 3.2, Task 4.1

---

### Task 4.3: Implement Language-Aware Station Names
**Duration**: 1 hour

- [ ] In StationSelector component, use computed property to get station names based on current locale
- [ ] If locale is `en`, use `station.nameEn`
- [ ] If locale is `zh`, use `station.nameZh`
- [ ] Sort stations by name in current language
- [ ] In MrtMap component, update marker labels based on current locale
- [ ] Watch locale changes and update all station name displays reactively

**Validation**: Station names switch between English and Chinese when language changes

**Dependencies**: Task 3.2, Task 2.3, Task 4.2

---

## Phase 5: Polish and Testing

### Task 5.1: Responsive Design for Mobile
**Duration**: 2 hours

- [ ] Test page on mobile viewport (< 768px width)
- [ ] Adjust layout for mobile:
  - Station selector takes full width at top
  - Map takes full width below selector
  - Map height adapts to viewport (min 400px)
- [ ] Ensure map controls (zoom buttons) are touch-friendly (min 44x44px)
- [ ] Ensure marker touch targets are at least 44x44px
- [ ] Test touch interactions: tap marker, pinch zoom, swipe pan
- [ ] Remove hover tooltips on touch devices (use tap instead)
- [ ] Test in both portrait and landscape orientations

**Validation**: Page is fully functional and usable on mobile devices, touch interactions work smoothly

**Dependencies**: Task 3.3, Task 2.5

---

### Task 5.2: Accessibility Enhancements
**Duration**: 2 hours

- [ ] Add ARIA labels to map container: `role="region"`, `aria-label="MRT station map"`
- [ ] Add ARIA labels to station markers: `aria-label="Station name, fare NT$XX"`
- [ ] Ensure station selector dropdown is keyboard navigable (Tab, Arrow keys, Enter)
- [ ] Add visible focus indicators to all interactive elements
- [ ] Test map controls are keyboard accessible
- [ ] Add "Reset View" button with keyboard support
- [ ] Test with screen reader (if possible) or review ARIA attributes
- [ ] Ensure color contrast meets WCAG AA standards (fare labels on markers)

**Validation**: Page is navigable via keyboard, ARIA labels are appropriate, focus indicators are visible

**Dependencies**: Task 3.3, Task 2.5

---

### Task 5.3: Write Unit Tests for Components
**Duration**: 2-3 hours

- [ ] Write unit tests for `fare-calculator.ts`:
  - Test same-station returns 0
  - Test valid fare lookup
  - Test bidirectional lookup (A-B and B-A)
  - Test missing fare returns null
- [ ] Write unit tests for `StationSelector.vue`:
  - Test stations are displayed in dropdown
  - Test selecting a station emits event
  - Test sorting by current language
- [ ] Write unit tests for `MrtFareFinderView.vue`:
  - Test data loading state
  - Test error handling
  - Test origin selection updates state
- [ ] Run tests: `npm run test:unit`
- [ ] Ensure all tests pass

**Validation**: Unit tests pass with good coverage (> 80%)

**Dependencies**: All implementation tasks

---

### Task 5.4: Write E2E Tests for User Workflows
**Duration**: 2-3 hours

- [ ] Write Playwright E2E test: "Navigate to MRT Fare Finder from menu"
  - Visit home page
  - Click MRT Fare Finder menu item
  - Assert URL is `/mrt-fare-finder`
  - Assert page title is visible
- [ ] Write E2E test: "Select origin and view fares"
  - Visit MRT Fare Finder page
  - Wait for data to load
  - Select origin station from dropdown
  - Assert map markers display fares
  - Assert selected station has origin style
- [ ] Write E2E test: "Click map marker to select origin"
  - Visit MRT Fare Finder page
  - Click on a map marker
  - Assert dropdown updates to reflect selected station
  - Assert fares appear on other markers
- [ ] Write E2E test: "Language switch updates station names"
  - Visit MRT Fare Finder page
  - Verify station names are in English
  - Switch language to Chinese
  - Verify station names are in Chinese
- [ ] Run tests: `npm run test:e2e`
- [ ] Ensure all tests pass

**Validation**: E2E tests pass, critical user workflows are verified

**Dependencies**: All implementation tasks

---

### Task 5.5: Performance Optimization
**Duration**: 1-2 hours

- [ ] Profile page load time (should be < 3 seconds)
- [ ] Optimize marker rendering if needed (use marker clustering for very dense areas if performance is poor)
- [ ] Ensure fare calculation is O(1) (already handled in Task 1.4)
- [ ] Minimize re-renders when origin changes (use Vue `computed` and `watch` efficiently)
- [ ] Lazy-load Leaflet library if possible to reduce initial bundle size
- [ ] Run Lighthouse performance audit
- [ ] Address any performance issues found

**Validation**: Page loads quickly, interactions are smooth, Lighthouse score > 90

**Dependencies**: All implementation tasks

---

### Task 5.6: Documentation and Data Update Guide
**Duration**: 1 hour

- [ ] Create `docs/MRT_DATA_UPDATE.md` or add section to README
- [ ] Document the structure of `mrt-stations.json`
- [ ] Document the structure of `mrt-fares.json`
- [ ] Explain how to add new stations or update fares
- [ ] Create a simple validation script (Node.js or npm script) to check data integrity:
  - All stations have required fields
  - All station IDs in fare data exist in station data
  - All fares are positive integers
- [ ] Add script to `package.json`: `"validate:mrt-data": "node scripts/validate-mrt-data.js"`
- [ ] Document how to run the validation script

**Validation**: Documentation is clear, validation script works correctly

**Dependencies**: All implementation tasks

---

### Task 5.7: Final QA and User Acceptance Testing
**Duration**: 1-2 hours

- [ ] Test all user workflows manually:
  - Navigate to page
  - Select origin from dropdown
  - View fares on map
  - Select origin by clicking map marker
  - Change origin and observe updates
  - Switch language
  - Use on mobile device
- [ ] Verify fare accuracy against official Taipei MRT fare chart (spot check 10-20 station pairs)
- [ ] Check for visual bugs or layout issues
- [ ] Test in different browsers (Chrome, Firefox, Safari if available)
- [ ] Test with slow network (throttle in DevTools) to verify loading states
- [ ] Test offline functionality (after initial load)
- [ ] Gather feedback from a test user if possible
- [ ] Fix any issues found

**Validation**: All user workflows work correctly, no critical bugs, page is production-ready

**Dependencies**: All previous tasks

---

## Summary

**Total Estimated Time**: 30-40 hours

**Phases**:
1. **Phase 1: Data Foundation** (6-7.5 hours) - Establish data files and calculation logic
2. **Phase 2: Map Integration** (7.25-9.25 hours) - Integrate Leaflet.js and render map
3. **Phase 3: User Interface** (5.5-7 hours) - Build page and components
4. **Phase 4: Internationalization** (2.5 hours) - Add bilingual support
5. **Phase 5: Polish and Testing** (10-13 hours) - Optimize, test, and finalize

**Parallelizable Work**:
- Tasks 1.1, 1.2 can be done in parallel (different data files)
- Tasks 2.1, 3.1 can be started early and in parallel
- Tasks 5.3, 5.4 (unit and E2E tests) can be done in parallel

**Critical Path**:
Task 1.1 → Task 1.2 → Task 1.4 → Task 2.3 → Task 2.5 → Task 3.3 → Task 5.7