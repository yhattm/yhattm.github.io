# Spec: MRT Map Display

## ADDED Requirements

### Requirement: Leaflet.js Map Integration

The application MUST integrate Leaflet.js mapping library with Vue 3 Composition API.

#### Scenario: Map library installation

- **GIVEN** the project needs map functionality
- **WHEN** dependencies are installed
- **THEN** `leaflet` package MUST be installed (latest stable version)
- **AND** `@types/leaflet` MUST be installed as a dev dependency
- **AND** Leaflet CSS MUST be imported in the component or globally

#### Scenario: Map initialization with Vue lifecycle

- **GIVEN** the MRT Fare Finder page component mounts
- **WHEN** the map container element is ready in DOM
- **THEN** a Leaflet map instance MUST be created using `L.map()`
- **AND** the map MUST be centered on Taipei Main Station (25.0478° N, 121.5170° E)
- **AND** the initial zoom level MUST be set to show the entire Taipei MRT network (zoom level ~11-12)
- **AND** the map instance MUST be stored in a Vue ref for lifecycle management

#### Scenario: Map cleanup on component unmount

- **GIVEN** the user navigates away from the MRT Fare Finder page
- **WHEN** the component is unmounted
- **THEN** the Leaflet map instance MUST be destroyed using `.remove()`
- **AND** all event listeners MUST be cleaned up
- **AND** no memory leaks MUST occur

---

### Requirement: OpenStreetMap Tile Layer

The application MUST use OpenStreetMap as the base map tile provider.

#### Scenario: OSM tile layer configuration

- **GIVEN** the Leaflet map is initialized
- **WHEN** the tile layer is added
- **THEN** the tile URL MUST use OpenStreetMap tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **AND** proper attribution MUST be displayed: "© OpenStreetMap contributors"
- **AND** the max zoom level MUST be set to 18
- **AND** the tile layer MUST have smooth loading behavior

#### Scenario: Map appears in both light and dark themes

- **GIVEN** the user switches between light and dark themes
- **WHEN** the map renders
- **THEN** the map MUST remain visible and usable in both themes
- **AND** map controls MUST be clearly visible in both themes
- **AND** marker labels MUST be legible against the map in both themes

---

### Requirement: Station Markers on Map

The application MUST display interactive markers for all MRT stations on the map.

#### Scenario: Markers for all stations

- **GIVEN** MRT station data is loaded
- **WHEN** the map renders
- **THEN** a marker MUST be placed at each station's coordinates
- **AND** all markers MUST be visible on the map
- **AND** markers MUST be colored according to their MRT line color
- **AND** markers MUST be rendered using Leaflet CircleMarker or DivIcon

#### Scenario: Marker appearance without origin selection

- **GIVEN** no origin station has been selected
- **WHEN** station markers render
- **THEN** each marker MUST display the station name (in current language)
- **AND** markers MUST be sized consistently (radius ~8-10px)
- **AND** markers MUST have the line color as background
- **AND** markers MUST NOT display fare information

#### Scenario: Marker appearance with origin selection

- **GIVEN** the user has selected an origin station
- **WHEN** station markers update
- **THEN** the origin marker MUST have a distinct style (e.g., star icon or larger size)
- **AND** all destination markers MUST display the fare from the origin
- **AND** destination markers MUST show station name and fare (e.g., "Ximen\nNT$20")
- **AND** fare text MUST be legible and positioned clearly on or near the marker

---

### Requirement: Interactive Marker Behavior

Station markers MUST respond to user interactions appropriately.

#### Scenario: Clicking marker to select origin

- **GIVEN** no origin station is selected
- **WHEN** the user clicks on any station marker
- **THEN** that station MUST be set as the origin
- **AND** all other markers MUST update to show fares from that origin
- **AND** a visual transition MUST occur (smooth, not jarring)
- **AND** the clicked marker MUST change to the origin style

#### Scenario: Hovering over marker shows tooltip

- **GIVEN** the user hovers over a station marker
- **WHEN** the mouse enters the marker area
- **THEN** a tooltip MUST appear showing the full station name (in current language)
- **AND** if a fare is displayed, the tooltip MUST also show the fare
- **AND** the tooltip MUST disappear when the mouse leaves the marker

#### Scenario: Mobile touch interaction with markers

- **GIVEN** the user is on a touch device
- **WHEN** the user taps a station marker
- **THEN** the marker MUST be selected as origin (no separate hover state)
- **AND** the touch target MUST be at least 44x44px for accessibility
- **AND** no tooltips MUST appear on touch (to avoid UI clutter)

---

### Requirement: Map Controls and Navigation

The map MUST provide standard navigation controls for users.

#### Scenario: Zoom controls

- **GIVEN** the map is displayed
- **WHEN** the user wants to zoom
- **THEN** zoom in and zoom out buttons MUST be visible
- **AND** zoom controls MUST be positioned in a corner (typically top-left or bottom-right)
- **AND** mouse wheel scrolling MUST zoom the map
- **AND** pinch-to-zoom MUST work on touch devices

#### Scenario: Pan and drag controls

- **GIVEN** the map is displayed
- **WHEN** the user clicks and drags on the map (not on a marker)
- **THEN** the map MUST pan in the direction of the drag
- **AND** panning MUST feel smooth and responsive
- **AND** touch swiping MUST pan the map on mobile devices

#### Scenario: Reset view button

- **GIVEN** the user has zoomed or panned away from the default view
- **WHEN** the user clicks a "Reset View" button
- **THEN** the map MUST animate back to the default center (Taipei Main Station)
- **AND** the zoom level MUST reset to the default (showing entire MRT network)

---

### Requirement: Custom Marker Icons and Styling

Markers MUST be visually styled to represent MRT stations and lines clearly.

#### Scenario: Line color coding

- **GIVEN** MRT stations belong to different lines with distinct colors
- **WHEN** markers are rendered
- **THEN** each marker MUST use the color of its primary line
- **AND** transfer stations (served by multiple lines) MUST show either the first line color or a combined visual indicator
- **AND** line colors MUST match official Taipei MRT branding

#### Scenario: Origin marker distinct styling

- **GIVEN** a station is selected as the origin
- **WHEN** its marker renders
- **THEN** the marker MUST have a visually distinct appearance (e.g., different icon, border, size)
- **AND** the origin marker MUST stand out clearly from destination markers
- **AND** the styling MUST make it obvious this is the starting point

#### Scenario: Fare label styling

- **GIVEN** fares are displayed on destination markers
- **WHEN** the markers render
- **THEN** fare labels MUST be in a clear, legible font
- **AND** fare labels MUST have sufficient contrast against the marker background
- **AND** fare labels MUST be positioned consistently (e.g., always below station name)
- **AND** labels MUST scale appropriately with zoom level (readable at default zoom)

---

### Requirement: Map Performance

The map MUST perform smoothly even with all MRT stations displayed.

#### Scenario: Marker rendering performance

- **GIVEN** there are 100+ MRT stations to display
- **WHEN** the map renders all markers
- **THEN** the initial render MUST complete within 2 seconds
- **AND** the map MUST remain responsive during marker rendering
- **AND** no frame drops MUST occur during panning or zooming

#### Scenario: Fare update performance

- **GIVEN** the user selects a new origin station
- **WHEN** fare labels on markers need to update
- **THEN** all marker updates MUST complete within 500ms
- **AND** the updates MUST appear smooth, without flickering
- **AND** the map MUST remain interactive during updates

---

### Requirement: Responsive Map Layout

The map display MUST adapt to different screen sizes and orientations.

#### Scenario: Desktop layout

- **GIVEN** the viewport width is >= 768px (desktop)
- **WHEN** the page renders
- **THEN** the map MUST occupy the primary content area (e.g., 70-80% of viewport width)
- **AND** the station selector dropdown MUST be positioned above or beside the map
- **AND** the map MUST have a minimum height of 500px

#### Scenario: Mobile layout

- **GIVEN** the viewport width is < 768px (mobile)
- **WHEN** the page renders
- **THEN** the station selector MUST be positioned above the map
- **AND** the map MUST occupy full width of the viewport
- **AND** the map height MUST be at least 400px but adaptive to viewport height
- **AND** controls MUST be appropriately sized for touch interaction

#### Scenario: Orientation change

- **GIVEN** the user rotates their mobile device
- **WHEN** the orientation changes from portrait to landscape (or vice versa)
- **THEN** the map MUST resize and re-center appropriately
- **AND** all markers MUST remain visible and correctly positioned
- **AND** no layout breaks MUST occur

---

### Requirement: Map Accessibility

The map component MUST be accessible to users with disabilities.

#### Scenario: Keyboard navigation for map controls

- **GIVEN** the user navigates using only keyboard
- **WHEN** the user tabs to map controls (zoom buttons, reset button)
- **THEN** controls MUST receive visible focus indicators
- **AND** controls MUST be activatable with Enter or Space key
- **AND** focus order MUST be logical and intuitive

#### Scenario: ARIA labels for map and markers

- **GIVEN** a screen reader user accesses the map
- **WHEN** the map component renders
- **THEN** the map container MUST have `role="region"` and `aria-label="MRT station map"`
- **AND** markers MUST have appropriate `aria-label` attributes (e.g., "Taipei Main Station, NT$20")
- **AND** the origin marker MUST be announced as "Selected origin: [station name]"

---

### Requirement: Error Handling for Map

The map component MUST gracefully handle errors related to map rendering and data.

#### Scenario: Tile loading failure

- **GIVEN** OpenStreetMap tiles fail to load (network error)
- **WHEN** the map attempts to render tiles
- **THEN** a fallback message MUST inform the user that map tiles couldn't load
- **BUT** station markers MUST still be visible and functional
- **AND** the user MUST still be able to select stations and view fares (without the map background)

#### Scenario: Invalid station coordinates

- **GIVEN** a station has invalid or missing latitude/longitude data
- **WHEN** the map attempts to render that station's marker
- **THEN** an error MUST be logged to the console
- **AND** that specific marker MUST be skipped (not rendered)
- **BUT** all other valid station markers MUST render correctly
- **AND** a warning MUST appear in the UI if multiple stations fail to render