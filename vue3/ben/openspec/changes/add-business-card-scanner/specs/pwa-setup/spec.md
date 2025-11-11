# pwa-setup Specification

## Purpose
Enables Progressive Web App (PWA) capabilities for the business card scanner, allowing users to install the app on their device and use it offline.

啟用名片掃描器的漸進式網頁應用程式 (PWA) 功能，讓用戶能夠將應用程式安裝到裝置上並離線使用。

## ADDED Requirements

### Requirement: Web App Manifest
The application MUST provide a web app manifest file for PWA installation.

#### Scenario: Manifest file exists
**Given** the application is deployed
**When** a browser checks for PWA capabilities
**Then** a `manifest.json` file is available at the root
**And** the manifest is linked in the HTML `<head>` via `<link rel="manifest">`
**And** the manifest passes validation

#### Scenario: Manifest metadata
**Given** the manifest file is loaded
**When** the browser parses it
**Then** the following fields are present:
  - `name`: "Ben's Business Card Scanner"
  - `short_name`: "Card Scanner"
  - `description`: Clear description of the app's purpose
  - `start_url`: Entry point for the app
  - `display`: "standalone" for app-like experience
  - `theme_color`: Matches app's primary theme color
  - `background_color`: Background for splash screen
**And** all required fields are valid

#### Scenario: App icons defined
**Given** the manifest includes an icons array
**When** the browser requests app icons
**Then** icons are provided in multiple sizes: 192x192, 512x512
**And** icons are in PNG or WebP format
**And** icons support both light and dark themes if applicable
**And** icon paths are correct and images are accessible

#### Scenario: Manifest orientation preference
**Given** the manifest specifies orientation
**When** the app is installed
**Then** the preferred orientation is "portrait-primary" for mobile scanning
**And** the orientation can be overridden by user device settings
**And** landscape mode still works but is not default

### Requirement: Service Worker Registration
The application MUST register and manage a service worker for offline functionality.

#### Scenario: Register service worker
**Given** the application loads in a supported browser
**When** the page initializes
**Then** the service worker is registered via `navigator.serviceWorker.register()`
**And** registration occurs after the page has loaded (not blocking initial render)
**And** registration is skipped in development mode or non-HTTPS contexts

#### Scenario: Service worker installation
**Given** the service worker is registered
**When** the service worker installs
**Then** critical assets are cached (HTML, CSS, JS, fonts)
**And** Tesseract.js worker files are pre-cached for offline OCR
**And** app icons and manifest are cached
**And** installation completes successfully

#### Scenario: Service worker activation
**Given** a service worker is installed
**When** it activates
**Then** old caches from previous versions are cleaned up
**And** the service worker claims all clients
**And** the app is ready for offline use

#### Scenario: Service worker update
**Given** a new service worker version is deployed
**When** the user revisits the app
**Then** the new service worker is downloaded in background
**And** the user is notified of the update (optional)
**And** the new service worker activates on next page load or manual refresh

### Requirement: Offline Functionality
The application MUST work offline for core features after initial visit.

#### Scenario: Offline page load
**Given** the user has visited the app at least once
**And** the service worker is active
**When** the user opens the app without internet connection
**Then** the app loads from the service worker cache
**And** the UI is fully functional
**And** a visual indicator shows offline status

#### Scenario: Offline OCR processing
**Given** the app is offline and service worker is active
**When** the user captures or uploads a card image
**Then** Tesseract.js loads from cache
**And** OCR processing works without network connection
**And** the result is stored in IndexedDB

#### Scenario: Offline data access
**Given** the app is offline
**When** the user views their card list
**Then** all previously stored cards load from IndexedDB
**And** card thumbnails display correctly from cache
**And** all card management features (view, edit, delete) work

#### Scenario: Offline limitations notice
**Given** the app is offline
**When** the user attempts a network-dependent feature (if any)
**Then** a clear message explains the feature requires internet
**And** the user is informed of their offline status
**And** alternative offline workflows are suggested

### Requirement: Install Prompts
The application MUST provide clear install prompts for users to add the app to their home screen.

#### Scenario: Detect install capability
**Given** the browser supports PWA installation
**When** the app loads
**Then** the application listens for the `beforeinstallprompt` event
**And** the event is captured and stored for later use
**And** custom install UI is prepared

#### Scenario: Show install prompt
**Given** the app can be installed
**And** the user has not previously dismissed the install prompt
**When** the user has been on the page for 30 seconds or completed an action
**Then** a non-intrusive install prompt is shown
**And** the prompt explains the benefits of installing
**And** the prompt includes "Install" and "Not Now" options

#### Scenario: User installs app
**Given** the install prompt is shown
**When** the user clicks "Install"
**Then** the browser's native install dialog is triggered via `prompt()`
**And** if the user accepts, the app is installed
**And** the install prompt is permanently hidden
**And** an `appinstalled` event is fired

#### Scenario: User dismisses prompt
**Given** the install prompt is shown
**When** the user clicks "Not Now" or dismisses
**Then** the prompt is hidden
**And** a timestamp is stored to avoid showing too frequently
**And** the prompt can be shown again after 7 days or on next visit

#### Scenario: Manual install trigger
**Given** the app is installed or installable
**When** the user navigates to app settings or about page
**Then** an "Add to Home Screen" button is available
**And** clicking it shows the install prompt manually
**And** the install flow proceeds normally

### Requirement: Standalone Mode Detection
The application MUST detect and adapt to standalone mode when running as installed PWA.

#### Scenario: Detect standalone mode
**Given** the app is installed and launched from home screen
**When** the app loads
**Then** `window.matchMedia('(display-mode: standalone)').matches` returns true
**And** OR `window.navigator.standalone` is true (iOS)
**And** the app recognizes it's running in standalone mode

#### Scenario: Standalone UI adaptation
**Given** the app is running in standalone mode
**When** the UI renders
**Then** the browser chrome is hidden (no address bar)
**And** the status bar is themed to match app colors
**And** navigation UI is adjusted for standalone context
**And** back navigation is handled within the app

#### Scenario: Browser mode UI
**Given** the app is running in a browser tab (not standalone)
**When** the UI renders
**Then** standard browser chrome is visible
**And** install prompts may be shown
**And** navigation works with browser back button

### Requirement: Caching Strategy
The application MUST implement an appropriate caching strategy for assets and data.

#### Scenario: Cache static assets
**Given** the service worker is installing
**When** the install event fires
**Then** the following assets are cached with "cache-first" strategy:
  - App HTML, CSS, JavaScript bundles
  - UI component library assets
  - Fonts and icons
  - App icons and manifest
**And** caching succeeds before installation completes

#### Scenario: Cache Tesseract.js files
**Given** the service worker is active
**When** Tesseract.js is first loaded
**Then** worker files and language data are cached
**And** subsequent loads use cached versions
**And** cache is updated when new versions are available

#### Scenario: Network-first for API calls (if any)
**Given** the app makes network requests
**When** a request is intercepted by the service worker
**Then** network-first strategy is used (try network, fall back to cache)
**And** responses are cached for offline use
**And** stale data is served if network fails

#### Scenario: Cache versioning
**Given** a new app version is deployed
**When** the service worker updates
**Then** old cache versions are deleted
**And** new assets are cached with updated version key
**And** no stale assets remain

### Requirement: App Update Notifications
The application MUST notify users when a new version is available.

#### Scenario: Detect new version
**Given** a new service worker is waiting to activate
**When** the app detects the waiting worker
**Then** the user sees a notification: "New version available"
**And** the notification includes a "Reload" button
**And** the notification is non-blocking and dismissible

#### Scenario: Apply update
**Given** an update notification is shown
**When** the user clicks "Reload"
**Then** the waiting service worker is activated via `skipWaiting()`
**And** all clients are claimed by the new worker
**And** the page reloads with the new version

#### Scenario: Auto-update after dismissal
**Given** the user dismisses an update notification
**When** they close and reopen the app
**Then** the new version activates automatically
**And** no data is lost during the update

### Requirement: Splash Screen
The application MUST provide a splash screen for standalone mode launches.

#### Scenario: Splash screen assets
**Given** the manifest defines icons and background_color
**When** the user launches the installed app
**Then** the browser generates a splash screen using:
  - App icon (from manifest)
  - App name (from manifest)
  - Background color (from manifest)
**And** the splash screen is shown during app load

#### Scenario: Splash screen duration
**Given** the splash screen is displayed
**When** the app finishes loading
**Then** the splash screen automatically dismisses
**And** the main app interface is shown
**And** the transition is smooth

## MODIFIED Requirements
None - this is a new capability.

## REMOVED Requirements
None - this is a new capability.
