# Spec: MRT Data Management

## ADDED Requirements

### Requirement: MRT Station Data Structure

The application MUST maintain a structured data file containing all operational Taipei MRT stations.

#### Scenario: Station data file structure

- **GIVEN** the application needs to load MRT station information
- **WHEN** the station data file is read
- **THEN** the file MUST be in JSON format
- **AND** the file MUST be located at `src/data/mrt-stations.json`
- **AND** each station entry MUST include: station ID, English name, Chinese name, latitude, longitude, line color code
- **AND** all coordinates MUST be in WGS84 format (latitude/longitude decimals)

#### Scenario: Station data completeness

- **GIVEN** the MRT station data file
- **WHEN** the application loads the data
- **THEN** the data MUST include ALL operational Taipei MRT stations across all lines
- **AND** each station MUST have both English and Traditional Chinese names
- **AND** station names MUST match official Taipei MRT naming
- **AND** coordinates MUST be accurate to the actual station location (within 50 meters)

#### Scenario: Station data format example

- **GIVEN** a station data entry
- **WHEN** the entry is parsed
- **THEN** it MUST conform to the following structure:
  ```json
  {
    "id": "BL12",
    "nameEn": "Taipei Main Station",
    "nameZh": "台北車站",
    "lat": 25.047924,
    "lng": 121.517081,
    "line": "BL",
    "lineColor": "#0070BD"
  }
  ```
- **AND** `id` MUST be a unique string identifier combining line code and station number
- **AND** `line` MUST be the line code (e.g., "BL" for Blue Line, "BR" for Brown Line)
- **AND** `lineColor` MUST be a hex color code matching the official line color

---

### Requirement: MRT Fare Data Structure

The application MUST maintain a fare matrix containing fare information for all station pairs.

#### Scenario: Fare data file structure

- **GIVEN** the application needs to load fare information
- **WHEN** the fare data file is read
- **THEN** the file MUST be in JSON format
- **AND** the file MUST be located at `src/data/mrt-fares.json`
- **AND** fares MUST be stored as a flat key-value object with bidirectional keys
- **AND** each key MUST be formatted as `"stationId1-stationId2"` or `"stationId2-stationId1"`
- **AND** each value MUST be an integer representing the fare in NT$

#### Scenario: Fare matrix bidirectional lookup

- **GIVEN** the fare between two stations A and B
- **WHEN** the application looks up the fare
- **THEN** the fare MUST be the same regardless of direction (A→B equals B→A)
- **AND** both `"A-B"` and `"B-A"` keys MAY be present with the same value
- **OR** only one direction key MAY be present, and the application MUST check both

#### Scenario: Fare data format example

- **GIVEN** fare data entries
- **WHEN** the entries are parsed
- **THEN** they MUST conform to the following structure:
  ```json
  {
    "BL12-BL13": 20,
    "BL12-BL14": 25,
    "BL12-R10": 20,
    "BR01-BL12": 30,
    ...
  }
  ```
- **AND** all fare values MUST be positive integers
- **AND** fare values MUST match official Taipei MRT fare chart

#### Scenario: Fare data completeness

- **GIVEN** the MRT fare data file
- **WHEN** the application loads the data
- **THEN** the data MUST include fares for ALL possible station pairs
- **AND** no station pair MUST be missing (except same-station pairs)
- **AND** same-station pairs MAY be omitted or set to 0

---

### Requirement: Data Loading and Caching

The application MUST efficiently load and cache MRT data for optimal performance.

#### Scenario: Initial data load

- **GIVEN** the user navigates to the MRT Fare Finder page for the first time
- **WHEN** the page component mounts
- **THEN** the application MUST load both station data and fare data
- **AND** the loading MUST be asynchronous using dynamic imports
- **AND** a loading indicator MUST be displayed until data is ready
- **AND** if data loading fails, an error message MUST be shown

#### Scenario: Data caching in memory

- **GIVEN** MRT data has been loaded once
- **WHEN** the user navigates away and returns to the MRT Fare Finder page
- **THEN** the data MUST be cached in memory
- **AND** the cached data MUST be reused without reloading from files
- **AND** no loading indicator MUST appear on subsequent visits

#### Scenario: Data validation on load

- **GIVEN** MRT data files are being loaded
- **WHEN** the data is parsed
- **THEN** the application MUST validate that station data is an array
- **AND** the application MUST validate that fare data is an object
- **AND** if validation fails, an error MUST be logged to console
- **AND** a user-friendly error message MUST be displayed

---

### Requirement: Fare Calculation Logic

The application MUST provide a reliable fare calculation function.

#### Scenario: Calculate fare between two stations

- **GIVEN** an origin station ID and a destination station ID
- **WHEN** the fare calculation function is called
- **THEN** the function MUST return the fare as an integer in NT$
- **AND** the function MUST first check for `"origin-destination"` key in fare data
- **AND** if not found, the function MUST check for `"destination-origin"` key
- **AND** if neither is found, the function MUST return `null`

#### Scenario: Same-station fare

- **GIVEN** the origin and destination are the same station
- **WHEN** the fare calculation function is called
- **THEN** the function MUST return 0
- **AND** no lookup in the fare data MUST occur

#### Scenario: Fare calculation performance

- **GIVEN** the fare data is loaded and cached
- **WHEN** a fare calculation is requested
- **THEN** the calculation MUST complete in under 1ms (average)
- **AND** the function MUST use O(1) lookup time
- **AND** no array iterations MUST be performed for lookup

---

### Requirement: Data Update Process

The application MUST provide a clear process for updating MRT station and fare data.

#### Scenario: Documentation for data updates

- **GIVEN** a maintainer needs to update fare data
- **WHEN** the maintainer reads the project documentation
- **THEN** there MUST be clear instructions in the README or a DATA.md file
- **AND** the instructions MUST explain the JSON format for stations and fares
- **AND** the instructions MUST provide a validation script to check data integrity

#### Scenario: Data update validation script

- **GIVEN** station or fare data has been modified
- **WHEN** the maintainer runs the validation script
- **THEN** the script MUST check that all stations have required fields
- **AND** the script MUST check that all station IDs in fare data exist in station data
- **AND** the script MUST check that fare values are positive integers
- **AND** the script MUST report any validation errors with clear messages

---

### Requirement: TypeScript Type Definitions

The application MUST provide strong TypeScript types for MRT data structures.

#### Scenario: Station data type

- **GIVEN** station data is used in the application
- **WHEN** TypeScript compilation occurs
- **THEN** a `Station` interface MUST be defined with all required properties
- **AND** the interface MUST enforce correct property types
- **AND** the station data JSON MUST conform to this interface

#### Scenario: Fare data type

- **GIVEN** fare data is used in the application
- **WHEN** TypeScript compilation occurs
- **THEN** a `FareMatrix` type MUST be defined as `Record<string, number>`
- **AND** helper types for station pair keys MAY be defined for better type safety
- **AND** the fare data JSON MUST conform to this type

#### Scenario: Type safety in fare calculations

- **GIVEN** the fare calculation function
- **WHEN** it is called from any part of the application
- **THEN** the function signature MUST enforce string station IDs as parameters
- **AND** the return type MUST be `number | null` to handle missing fares
- **AND** TypeScript MUST catch any misuse at compile time