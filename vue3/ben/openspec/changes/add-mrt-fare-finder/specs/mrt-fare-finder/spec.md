# Spec: MRT Fare Finder Page

## ADDED Requirements

### Requirement: MRT Fare Finder Navigation Entry

The application MUST provide a navigation menu item to access the MRT Fare Finder tool.

#### Scenario: User navigates to MRT Fare Finder from menu

- **GIVEN** the user is on any page of the application
- **WHEN** the user views the navigation menu
- **THEN** the menu MUST display "MRT Fare Finder" link in English
- **AND** the menu MUST display "捷運票價查詢" link in Chinese
- **AND** clicking the link MUST navigate to `/mrt-fare-finder` route
- **AND** the menu item MUST show active state when on MRT Fare Finder page

#### Scenario: Menu item respects language preference

- **GIVEN** the user has selected a language preference
- **WHEN** the navigation menu renders
- **THEN** the MRT Fare Finder menu item MUST display in the selected language
- **AND** switching language MUST update the menu item text immediately

---

### Requirement: Station Selection Interface

The application MUST provide an intuitive interface for users to select the origin MRT station.

#### Scenario: User selects origin station from dropdown

- **GIVEN** the user is on the MRT Fare Finder page
- **WHEN** the user opens the station selection dropdown
- **THEN** the dropdown MUST display all operational MRT stations
- **AND** stations MUST be displayed in alphabetical order based on current language
- **AND** selecting a station MUST update the map to show fares from that origin
- **AND** the selected station MUST be visually highlighted on the map

#### Scenario: User selects origin station by clicking map marker

- **GIVEN** the user is on the MRT Fare Finder page with no origin selected
- **WHEN** the user clicks on any station marker on the map
- **THEN** that station MUST be set as the origin
- **AND** the dropdown MUST update to reflect the selected station
- **AND** all other station markers MUST display fares from the selected origin
- **AND** the selected origin marker MUST have a distinct visual style

#### Scenario: User changes origin station

- **GIVEN** the user has already selected an origin station
- **WHEN** the user selects a different origin station (via dropdown or map)
- **THEN** all fare displays MUST update immediately to show fares from the new origin
- **AND** the previous origin marker MUST revert to default style
- **AND** the new origin marker MUST show the distinct origin style
- **AND** no page reload MUST occur

---

### Requirement: Real-time Fare Display on Map

The application MUST display fare information on map markers when an origin station is selected.

#### Scenario: Fare markers appear after origin selection

- **GIVEN** the user has selected an origin station
- **WHEN** the map renders
- **THEN** every destination station marker MUST display the fare from the origin
- **AND** fare MUST be displayed in NT$ (New Taiwan Dollar)
- **AND** the origin station marker MUST NOT display a fare (marked as origin)
- **AND** fare values MUST match the official Taipei MRT fare chart

#### Scenario: Fare display respects currency format

- **GIVEN** fares are displayed on map markers
- **WHEN** the user views station markers
- **THEN** fares MUST be formatted as "NT$20", "NT$25", etc.
- **AND** there MUST be NO decimal places for fares
- **AND** the currency symbol MUST be consistent across all markers

#### Scenario: No origin selected state

- **GIVEN** the user has not yet selected an origin station
- **WHEN** the map renders
- **THEN** all station markers MUST display only station names
- **AND** no fare information MUST be shown
- **AND** a hint message MUST prompt the user to select an origin station

---

### Requirement: Bilingual Station Information

The application MUST display MRT station information in both English and Traditional Chinese based on user preference.

#### Scenario: Station names in English

- **GIVEN** the user has selected English as the language
- **WHEN** the MRT Fare Finder page renders
- **THEN** the station dropdown MUST show English station names
- **AND** map markers MUST display English station names
- **AND** station names MUST follow official Taipei MRT English naming (e.g., "Taipei Main Station")

#### Scenario: Station names in Traditional Chinese

- **GIVEN** the user has selected Traditional Chinese as the language
- **WHEN** the MRT Fare Finder page renders
- **THEN** the station dropdown MUST show Traditional Chinese station names
- **AND** map markers MUST display Traditional Chinese station names
- **AND** station names MUST follow official naming (e.g., "台北車站")

#### Scenario: Language switching updates station names

- **GIVEN** the user is viewing the MRT Fare Finder page
- **WHEN** the user switches the language preference
- **THEN** all station names in the dropdown MUST update to the new language
- **AND** all station names on map markers MUST update to the new language
- **AND** all other UI text MUST update to the new language
- **AND** the selected origin station MUST remain selected after language switch

---

### Requirement: Responsive Mobile Design

The MRT Fare Finder page MUST be fully functional and usable on mobile devices.

#### Scenario: Mobile layout with touch interactions

- **GIVEN** the user accesses the page on a mobile device (viewport width < 768px)
- **WHEN** the page renders
- **THEN** the station dropdown MUST be easily tappable with finger
- **AND** map markers MUST be appropriately sized for touch interaction (minimum 44x44px touch target)
- **AND** the map MUST support touch gestures (pinch-to-zoom, pan)
- **AND** fare information on markers MUST be legible on small screens

#### Scenario: Dropdown is primary selection on mobile

- **GIVEN** the user is on a mobile device
- **WHEN** the user wants to select an origin station
- **THEN** the dropdown selector MUST be prominently positioned at the top
- **AND** the dropdown MUST be the recommended method (shown in hint text)
- **BUT** map marker clicks MUST still work as an alternative method

---

### Requirement: Page Loading and Performance

The MRT Fare Finder page MUST load efficiently and provide responsive interactions.

#### Scenario: Initial page load

- **GIVEN** the user navigates to the MRT Fare Finder page for the first time
- **WHEN** the page loads
- **THEN** all MRT station data MUST load within 2 seconds on a standard connection
- **AND** the map MUST render and be interactive within 3 seconds
- **AND** a loading indicator MUST be shown while data is being fetched
- **AND** the page MUST be usable once the loading indicator disappears

#### Scenario: Origin selection is instant

- **GIVEN** the MRT Fare Finder page has fully loaded
- **WHEN** the user selects an origin station
- **THEN** fare calculations MUST complete within 100ms
- **AND** map marker updates MUST be visually immediate (no perceptible lag)
- **AND** no loading indicators MUST appear for fare updates

---

### Requirement: Offline Functionality

The MRT Fare Finder MUST work offline after the initial page load.

#### Scenario: Using fare finder without internet connection

- **GIVEN** the user has loaded the MRT Fare Finder page once
- **AND** all station data and fare data have been cached
- **WHEN** the user loses internet connection
- **THEN** the user MUST still be able to select origin stations
- **AND** fare calculations MUST still work correctly
- **AND** the map MUST still display and be interactive
- **AND** no error messages about missing data MUST appear

---

### Requirement: Accessibility

The MRT Fare Finder page MUST be accessible to users with disabilities.

#### Scenario: Keyboard navigation support

- **GIVEN** the user navigates using only keyboard
- **WHEN** the user tabs through the page elements
- **THEN** the station dropdown MUST be keyboard accessible
- **AND** the user MUST be able to select stations using arrow keys and Enter
- **AND** all interactive map controls MUST be keyboard accessible
- **AND** focus indicators MUST be clearly visible

#### Scenario: Screen reader support

- **GIVEN** the user is using a screen reader
- **WHEN** the page renders
- **THEN** the station dropdown MUST have appropriate ARIA labels
- **AND** map markers MUST have alt text with station name and fare
- **AND** the origin station selection MUST be announced
- **AND** fare updates MUST be announced to the screen reader

---

### Requirement: Error Handling

The application MUST gracefully handle error conditions related to MRT fare lookup.

#### Scenario: Missing fare data

- **GIVEN** fare data for a specific station pair is missing
- **WHEN** the user selects that origin station
- **THEN** the affected destination marker MUST display "N/A" instead of a fare
- **AND** a warning message MUST inform the user that some fare data is unavailable
- **BUT** other station fares MUST still display correctly

#### Scenario: Invalid station selection

- **GIVEN** the application receives an invalid station identifier
- **WHEN** the fare lookup is attempted
- **THEN** an error message MUST be displayed to the user
- **AND** the map MUST revert to the no-origin-selected state
- **AND** the dropdown MUST be reset to the placeholder state