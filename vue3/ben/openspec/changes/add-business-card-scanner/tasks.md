# Implementation Tasks

## Phase 1: Foundation & Infrastructure

### 1.1 Install Dependencies
- [x] Install tesseract.js (`npm install tesseract.js`)
- [x] Install idb library for IndexedDB (`npm install idb`)
- [x] Verify TypeScript types are available
- [x] Update package.json with new dependencies

**Validation**: Run `npm install` successfully, no errors

### 1.2 Create TypeScript Types
- [x] Create `src/types/business-card.ts` with interfaces:
  - `BusinessCard`
  - `CardImage`
  - `CardData`
  - `OcrResult`
- [x] Create IndexedDB schema types
- [x] Export types for use across the application

**Validation**: Types compile without errors, importable in other files

### 1.3 Setup IndexedDB Database
- [x] Create `src/services/db.ts` for database initialization
- [x] Define database schema with 'cards' and 'images' stores
- [x] Create indexes (e.g., 'by-timestamp' on cards)
- [x] Implement database upgrade logic for versioning
- [x] Add database utility functions (get, add, update, delete)

**Validation**: Database initializes on first load, stores are created

### 1.4 Create OCR Service
- [x] Create `src/services/ocr-service.ts` with OCR interface
- [x] Implement Tesseract.js OCR service
- [x] Configure Tesseract with English and Chinese language support
- [x] Add loading/progress tracking for OCR operations
- [x] Add error handling for OCR failures
- [ ] **Enhancement**: Implement region-based OCR for improved recognition
  - [ ] Add multi-region OCR processing (divide image into top/middle/bottom sections)
  - [ ] Implement automatic retry with different crop regions for low-confidence results (< 50%)
  - [ ] Add region detection using contrast and edge detection
  - [ ] Implement intelligent merging of results from multiple regions
  - [ ] Add manual region selection UI for re-scanning specific areas
  - [ ] Create cropping tool overlay for user-defined region boundaries
  - [ ] Track and display confidence scores per region
  - [ ] Add option to compare full-image vs region-based results

**Validation**: OCR service can process test image and return text, with improved accuracy through region-based processing

### 1.5 Create Image Processing Utilities
- [x] Create `src/utils/image-processing.ts`
- [x] Implement image compression function (max 1920x1080, 80% quality)
- [x] Implement thumbnail generation (max 200x200, 70% quality)
- [x] Handle different image formats (JPEG, PNG, WebP)
- [x] Add error handling for image processing failures

**Validation**: Test images are compressed and thumbnails generated correctly

---

## Phase 2: OCR Capture & Processing

### 2.1 Create Field Parser
- [x] Create `src/utils/field-parser.ts`
- [x] Implement regex patterns for email, phone, URL detection
- [x] Implement heuristics for name, title, company extraction
- [x] Add social media URL detection (LinkedIn, etc.)
- [x] Add fax number detection
- [x] Test with sample business card OCR text

**Validation**: Parser correctly extracts fields from test OCR text

### 2.2 Build Camera Capture Component
- [x] Create `src/components/scanner/CameraCapture.vue`
- [x] Implement camera permission request
- [x] Display live camera preview using MediaDevices API
- [x] Add capture button to take still image
- [x] Add retake functionality
- [x] Handle camera permission denied gracefully
- [x] Add fallback to file upload

**Validation**: Camera opens, displays preview, captures image

### 2.3 Build Image Upload Component
- [x] Add file input for image upload
- [x] Support drag-and-drop image upload
- [x] Validate file type (JPEG, PNG, WebP only)
- [x] Display selected image preview
- [x] Show error for invalid file types

**Validation**: Users can upload images via file picker or drag-and-drop

### 2.4 Build OCR Processor Component
- [x] Create `src/components/scanner/OcrProcessor.vue`
- [x] Integrate with OCR service
- [x] Show loading indicator during OCR processing
- [x] Display OCR progress percentage
- [x] Handle OCR errors with user-friendly messages
- [x] Emit OCR results to parent component

**Validation**: OCR processes uploaded/captured images, shows progress

### 2.5 Build Card Form Component
- [x] Create `src/components/scanner/CardForm.vue`
- [x] Display editable form with all card fields:
  - Name, Title, Company
  - Phone, Email, Address
  - Website, Social Media, Fax
  - Raw OCR (read-only)
- [x] Add form validation (email format, phone format)
- [x] Add save/cancel buttons
- [x] Emit save event with form data
- [ ] **Enhancement**: Ensure raw OCR text display preserves layout
  - [ ] Verify `font-mono` class is applied to raw OCR textarea
  - [ ] Add `whitespace-pre-wrap` class or equivalent CSS for whitespace preservation
  - [ ] Test with sample business cards to ensure layout mirrors card arrangement
  - [ ] Verify line breaks and spacing are preserved in both edit form and card list view

**Validation**: Form displays OCR-extracted data with layout-preserved raw text, allows editing

---

## Phase 3: Data Management (Pinia Store)

### 3.1 Create Business Card Store
- [x] Create `src/stores/businessCard.ts`
- [x] Define reactive state: `cards`, `isLoading`, `error`
- [x] Implement `loadCards()` action to fetch from IndexedDB
- [x] Implement `addCard()` action to save new card + image
- [x] Implement `updateCard()` action to modify existing card
- [x] Implement `deleteCard()` action to remove card + image
- [x] Implement `exportToJson()` getter for JSON export

**Validation**: Store loads cards, performs CRUD operations successfully

### 3.2 Integrate Store with IndexedDB
- [x] Connect store actions to database service
- [x] Handle async operations with proper error handling
- [x] Update reactive state after database operations
- [x] Add timestamps (timestamp, lastModified) automatically

**Validation**: Store operations persist to IndexedDB, reload on page refresh

---

## Phase 4: User Interface - Scanner View

### 4.1 Create Main Scanner View
- [x] Create `src/views/BusinessCardScannerView.vue`
- [x] Add page header with title and subtitle
- [x] Integrate CameraCapture component
- [x] Integrate OcrProcessor component
- [x] Show scan status/progress
- [x] Handle OCR completion and display results in CardForm
- [x] Add bilingual support (i18n)

**Validation**: Scanner view displays, user can capture/upload and see OCR results

### 4.2 Add Scanner to Router
- [x] Update `src/router/index.ts`
- [x] Add route: `/business-card-scanner`
- [x] Configure lazy loading for the view
- [x] Add route metadata if needed

**Validation**: Navigate to `/business-card-scanner` works

### 4.3 Add Navigation Link
- [x] Update NavBar or ToolsHomeView to include link to scanner
- [x] Add appropriate icon for business card scanner
- [x] Add bilingual labels

**Validation**: Scanner is accessible from navigation

### 4.4 Implement Save Card Flow
- [x] On CardForm save event, validate data
- [x] Compress image and generate thumbnail
- [x] Call store's `addCard()` with card data and image
- [x] Show success message
- [x] Clear form and allow new scan
- [x] Handle save errors gracefully

**Validation**: Scanned cards are saved to IndexedDB

---

## Phase 5: User Interface - Card List

### 5.1 Create Card List Item Component
- [x] Create `src/components/scanner/CardListItem.vue`
- [x] Display card thumbnail
- [x] Show preview: name, title, company, scan timestamp
- [x] Add View, Edit, Delete action buttons
- [x] Format timestamp in localized format
- [x] Handle missing fields gracefully

**Validation**: Card list item displays card preview correctly

### 5.2 Create Card List Component
- [x] Create `src/components/scanner/CardList.vue`
- [x] Display all cards from store
- [x] Sort cards by timestamp (newest first)
- [x] Show empty state when no cards
- [x] Show card count in header
- [x] Integrate CardListItem for each card

**Validation**: Card list displays all saved cards

### 5.3 Implement Card List View
- [x] Add card list section to BusinessCardScannerView
- [x] Or create separate route `/business-card-scanner/cards` (optional)
- [x] Load cards on mount using store
- [x] Show loading state while loading
- [x] Handle errors (failed to load)

**Validation**: Users can see all their saved cards

### 5.4 Add Search/Filter Functionality
- [x] Add search input to card list
- [x] Filter cards by text (name, company, email, phone)
- [x] Update list reactively as user types
- [x] Show "no results" message when filter returns nothing
- [x] Add clear search button

**Validation**: Search filters card list correctly

### 5.5 Add Sorting Options
- [x] Add sort dropdown/buttons
- [x] Implement sort by date (default)
- [x] Implement sort by name
- [x] Implement sort by company
- [x] Update card list when sort changes

**Validation**: Cards can be sorted by different criteria

---

## Phase 6: User Interface - Image Viewer & Edit

### 6.1 Create Image Viewer Component
- [x] Create `src/components/scanner/ImageViewer.vue`
- [x] Display full-size image in modal
- [x] Add zoom in/out controls
- [x] Add close button and ESC key support
- [x] Click outside to close
- [x] Prevent body scroll when modal open
- [x] Add keyboard navigation (arrow keys for next/prev if multiple)

**Validation**: Clicking thumbnail opens full-size image viewer

### 6.2 Implement Edit Card Flow
- [x] On Edit action, open CardForm with existing data
- [x] Load full card data from store
- [x] Populate form fields
- [x] On save, call store's `updateCard()`
- [x] Update lastModified timestamp
- [x] Show success message
- [x] Refresh card list

**Validation**: Users can edit card data and save changes

### 6.3 Implement Delete Card Flow
- [x] On Delete action, show confirmation dialog
- [x] Warn user deletion is permanent
- [x] On confirm, call store's `deleteCard()`
- [x] Remove card from list
- [x] Show success message
- [x] Handle errors (e.g., card not found)

**Validation**: Users can delete cards with confirmation

---

## Phase 7: Export Functionality

### 7.1 Create Export Dialog Component
- [x] Create `src/components/scanner/ExportDialog.vue`
- [x] Display export preview (first few lines of JSON)
- [x] Show count of cards to export
- [x] Add "Download" button
- [x] Add "Copy to Clipboard" button
- [x] Add "Cancel" button
- [x] Handle modal open/close

**Validation**: Export dialog displays and shows correct preview

### 7.2 Implement JSON Export
- [x] In store, implement `exportToJson()` method
- [x] Serialize cards to JSON (exclude image blobs, keep imageIds)
- [x] Pretty-print JSON with 2-space indentation
- [x] Add metadata (export timestamp, count)

**Validation**: Export generates valid JSON

### 7.3 Implement Download Functionality
- [x] Create download utility function
- [x] Generate filename with timestamp (business-cards-YYYY-MM-DD-HHmmss.json)
- [x] Create Blob and trigger download
- [x] Show success message
- [x] Handle download errors

**Validation**: Users can download JSON file

### 7.4 Implement Copy to Clipboard
- [ ] Use Clipboard API to copy JSON string
- [ ] Show success feedback (toast or button state change)
- [ ] Handle clipboard permission issues
- [ ] Provide fallback if Clipboard API unavailable

**Validation**: Users can copy JSON to clipboard

### 7.5 Add Export All Button
- [x] Add "Export All" button to card list header
- [x] On click, open export dialog with all cards
- [x] Pass all cards to export dialog

**Validation**: Users can export all cards

### 7.6 Add Export Selected (Optional)
- [ ] Add multi-select mode to card list
- [ ] Add checkboxes to each card
- [ ] Track selected cards
- [ ] Add "Export Selected" button
- [ ] Export only selected cards

**Validation**: Users can select and export specific cards

---

## Phase 8: Internationalization

### 8.1 Add English Translations
- [x] Update `src/locales/en.json`
- [x] Add translations for:
  - Scanner page title, subtitle, instructions
  - Form field labels
  - Button labels (Capture, Upload, Save, Edit, Delete, Export)
  - Status messages (scanning, success, errors)
  - Empty states
- [x] Add error messages

**Validation**: All text renders correctly in English

### 8.2 Add Chinese Translations
- [x] Update `src/locales/zh.json`
- [x] Add Chinese translations for all English keys
- [x] Ensure proper Traditional Chinese characters
- [x] Test date/time formatting in Chinese

**Validation**: All text renders correctly in Chinese, switching languages works

---

## Phase 9: Styling & Responsiveness

### 9.1 Style Scanner View
- [x] Apply Tailwind CSS classes for layout
- [x] Use shadcn-vue components (Card, Button, Input, etc.)
- [x] Ensure consistent spacing and alignment
- [x] Add hover/focus states
- [x] Support light and dark themes

**Validation**: Scanner view looks good in both themes

### 9.2 Style Card List
- [x] Create responsive grid layout (1 col mobile, 2-3 cols desktop)
- [x] Style card list items with shadcn Card component
- [x] Ensure thumbnails are properly sized
- [x] Add loading skeletons
- [x] Test on mobile, tablet, desktop

**Validation**: Card list is responsive and visually appealing

### 9.3 Style Modal Dialogs
- [x] Style image viewer modal
- [x] Style export dialog
- [x] Style confirmation dialogs
- [x] Ensure modals work on mobile (fullscreen or adaptive)
- [x] Test modal backdrop and close behavior

**Validation**: Modals look good and function well on all devices

---

## Phase 10: Mobile Camera Features

### 10.1 Implement getUserMedia Camera Access
- [x] Create `src/composables/useCamera.ts` composable
- [x] Check browser support for `navigator.mediaDevices.getUserMedia`
- [x] Request video stream with `facingMode: 'environment'` (rear camera)
- [x] Handle camera permission requests and denials
- [x] Provide fallback to HTML5 `<input capture="environment">`
- [x] Stop camera stream properly on component unmount
- [ ] **Change**: Remove automatic camera start from `onMounted()` in CameraCapture.vue
- [ ] **Change**: Implement lazy camera initialization on first capture button press
- [ ] **Change**: Track camera initialization state to avoid re-requesting on subsequent captures
- [ ] **Change**: Update UI to show appropriate messaging before camera starts

**Validation**: Camera does NOT start automatically, only starts when capture button is pressed

### 10.2 Build Live Camera Preview
- [x] Create video element for camera preview
- [x] Set proper aspect ratio (4:3 or 16:9)
- [x] Mirror preview for front camera, don't mirror for rear
- [x] Add camera controls overlay (capture, flash, focus, switch)
- [x] Position controls for easy thumb access on mobile
- [x] Handle orientation changes gracefully

**Validation**: Live preview displays with proper controls overlay

### 10.3 Implement Flash/Torch Control
- [x] Check torch capability via `track.getCapabilities().torch`
- [x] Add flash toggle button (show only if supported)
- [x] Toggle torch on/off via `applyConstraints({ advanced: [{ torch: true }] })`
- [x] Update button icon to reflect current state
- [x] Handle torch not supported gracefully

**Validation**: Flash toggles on supported devices, hidden on others

### 10.4 Implement Auto-Focus Control
- [ ] Enable continuous auto-focus by default (`focusMode: 'continuous'`)
- [ ] Add tap-to-focus functionality on preview
- [ ] Show focus indicator animation at tap location
- [ ] Add manual/continuous focus mode toggle button
- [ ] Provide visual feedback for focus confirmation

**Validation**: Camera focuses automatically and responds to taps

### 10.5 Implement Camera Switching
- [x] Enumerate available video devices
- [x] Show camera switch button only if multiple cameras exist
- [x] Switch between front (`facingMode: 'user'`) and rear (`facingMode: 'environment'`)
- [x] Stop current stream before requesting new camera
- [x] Update preview mirroring based on active camera

**Validation**: Can switch between front and rear cameras

### 10.6 Capture Still Image from Stream
- [x] Draw current video frame to canvas element
- [x] Convert canvas to Blob in JPEG format (quality: 0.9)
- [x] Pause or stop video stream after capture
- [x] Display captured image for review
- [x] Provide "Use This Image" and "Retake" buttons

**Validation**: Captures high-quality still images from live preview

### 10.7 Implement Image Rotation Tool
- [ ] Add rotate button to image preview
- [ ] Rotate image 90° clockwise on each click
- [ ] Use canvas rotation transformation
- [ ] Preserve image quality during rotation
- [ ] Apply rotation before OCR processing

**Validation**: Can rotate captured images before processing

### 10.8 Implement Image Cropping Tool
- [ ] Create cropping overlay with draggable corners
- [ ] Show highlighted area to be kept
- [ ] Implement touch/mouse drag for corner handles
- [ ] Apply crop via canvas drawing
- [ ] Provide confirm and cancel buttons

**Validation**: Can crop images to focus on business card area

### 10.9 Implement Touch Gestures
- [ ] Add pinch-to-zoom gesture handler (1x to 4x)
- [ ] Add pan gesture for zoomed images
- [ ] Add double-tap to toggle zoom (1x ↔ 2x)
- [ ] Constrain pan to image bounds
- [ ] Add reset zoom button

**Validation**: Touch gestures work smoothly on mobile

### 10.10 Implement Orientation Detection
- [ ] Listen to `window.orientation` or Screen Orientation API
- [ ] Adjust UI layout on orientation change
- [ ] Read EXIF orientation data from images
- [ ] Auto-rotate images to correct orientation
- [ ] Optionally lock orientation during capture

**Validation**: UI adapts to device orientation changes

### 10.11 Build Tabbed Interface
- [x] Create tab component with "Camera" and "Upload" tabs
- [x] Default to Camera tab on mobile, Upload tab on desktop
- [x] Stop camera stream when switching to Upload tab
- [x] Initialize camera when switching to Camera tab
- [x] Remember last selected tab (optional)

**Validation**: Tab switching works smoothly, camera released properly

### 10.12 Optimize for Mobile UI
- [x] Ensure minimum 44x44px touch targets for all buttons
- [x] Add adequate spacing between buttons
- [x] Position buttons for comfortable thumb reach
- [x] Add haptic feedback for button presses (if supported)
- [x] Implement full-screen camera mode

**Validation**: All controls are easily tappable on mobile devices

---

## Phase 11: PWA Setup

### 11.1 Create Web App Manifest
- [ ] Create `public/manifest.json` with app metadata:
  - name: "Ben's Business Card Scanner"
  - short_name: "Card Scanner"
  - description, start_url, display: "standalone"
  - theme_color, background_color
- [ ] Generate app icons (192x192, 512x512) in PNG format
- [ ] Add icons to `public/icons/` directory
- [ ] Link manifest in `index.html`: `<link rel="manifest" href="/manifest.json">`

**Validation**: Manifest validates with no errors, icons display

### 11.2 Create Service Worker
- [ ] Create `public/sw.js` service worker file
- [ ] Implement install event to cache critical assets:
  - HTML, CSS, JS bundles
  - Tesseract.js worker files
  - App icons and manifest
  - Fonts and UI components
- [ ] Implement activate event to clean old caches
- [ ] Implement fetch event with caching strategy:
  - Cache-first for static assets
  - Network-first for API calls (if any)

**Validation**: Service worker installs and caches assets

### 11.3 Register Service Worker
- [ ] Add service worker registration in `src/main.ts`
- [ ] Register after page load (not blocking initial render)
- [ ] Skip registration in development mode
- [ ] Handle registration success and errors
- [ ] Log service worker lifecycle events

**Validation**: Service worker registers successfully in production

### 11.4 Implement Offline Functionality
- [ ] Test app loads offline after first visit
- [ ] Ensure Tesseract.js works offline (cached)
- [ ] Verify IndexedDB works offline
- [ ] Add offline status indicator
- [ ] Test OCR processing works offline

**Validation**: Core features work without internet connection

### 11.5 Implement Install Prompts
- [ ] Listen for `beforeinstallprompt` event
- [ ] Create custom install prompt UI component
- [ ] Show prompt after user engagement (30s or action completed)
- [ ] Trigger browser install dialog on "Install" click
- [ ] Handle prompt dismissal (store timestamp, don't show for 7 days)
- [ ] Listen for `appinstalled` event

**Validation**: Install prompt shows, installation works

### 11.6 Implement Standalone Mode Detection
- [ ] Detect standalone mode: `window.matchMedia('(display-mode: standalone)')`
- [ ] Detect iOS standalone: `window.navigator.standalone`
- [ ] Adapt UI for standalone mode (hide browser-specific elements)
- [ ] Handle navigation within standalone app
- [ ] Style status bar for standalone mode

**Validation**: App detects and adapts to standalone mode

### 11.7 Implement Update Notifications
- [ ] Detect new service worker waiting to activate
- [ ] Show update notification: "New version available"
- [ ] Add "Reload" button to apply update
- [ ] Activate new worker via `skipWaiting()`
- [ ] Reload page to use new version
- [ ] Auto-update on app reopen if user dismissed notification

**Validation**: Users are notified of updates and can apply them

### 11.8 Create Splash Screen Assets
- [ ] Use manifest icons and background_color for splash
- [ ] Test splash screen on various devices
- [ ] Ensure smooth transition from splash to app

**Validation**: Splash screen displays on standalone launch

### 11.9 Configure Caching Strategy
- [ ] Set cache names with version numbers
- [ ] Implement cache-first for static assets
- [ ] Implement network-first for dynamic data
- [ ] Set cache expiration policies
- [ ] Clean up old caches on service worker activation

**Validation**: Caching strategy balances freshness and offline capability

---

## Phase 12: Testing

### 12.1 Unit Tests
- [ ] Test field parser utility with various OCR texts
- [ ] Test image compression utility
- [ ] Test store actions (mocked IndexedDB)
- [ ] Test form validation logic
- [ ] Aim for >70% code coverage on utilities

**Validation**: Run `npm run test:unit`, all tests pass

### 12.2 Component Tests
- [ ] Test CameraCapture component (mock camera API)
- [ ] Test CardForm validation
- [ ] Test CardListItem rendering
- [ ] Test ExportDialog functionality

**Validation**: Component tests pass

### 12.3 E2E Tests (Playwright)
- [ ] Test complete scan workflow (with mocked camera)
- [ ] Test upload image and save card
- [ ] Test edit card flow
- [ ] Test delete card flow
- [ ] Test export all cards
- [ ] Test search/filter

**Validation**: Run `npm run test:e2e`, all E2E tests pass

---

## Phase 13: Accessibility & Performance

### 13.1 Accessibility Audit
- [ ] Ensure all interactive elements have focus indicators
- [ ] Add ARIA labels to all buttons and inputs
- [ ] Test keyboard navigation (Tab, Enter, ESC)
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Verify color contrast meets WCAG AA
- [ ] Add alt text for images

**Validation**: Accessibility checklist complete, no major issues

### 13.2 Performance Optimization
- [ ] Lazy load Tesseract.js worker
- [ ] Optimize image compression settings
- [ ] Add virtual scrolling if card list >100 items
- [ ] Test with 50+ saved cards
- [ ] Profile with Chrome DevTools

**Validation**: App remains responsive with many cards

### 13.3 Storage Management
- [ ] Add storage usage indicator
- [ ] Handle quota exceeded errors
- [ ] Warn users when storage is >80% full
- [ ] Test with many cards to approach quota

**Validation**: Storage management handles quota gracefully

---

## Phase 14: Documentation & Deployment

### 14.1 Code Documentation
- [ ] Add JSDoc comments to complex functions
- [ ] Document OCR service interface
- [ ] Document store actions
- [ ] Add inline comments for tricky logic

**Validation**: Code is well-documented

### 14.2 User Documentation (Optional)
- [ ] Add help/guide section in app
- [ ] Explain how to get best OCR results
- [ ] Provide tips for capturing business cards
- [ ] Add FAQ section

**Validation**: Users have guidance on using the feature

### 14.3 Build & Deploy
- [ ] Run type-check: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors
- [ ] Run build: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy to GitHub Pages: `npm run deploy`

**Validation**: Production build succeeds, deployed site works

---

## Dependencies & Parallelization

**Can be done in parallel**:
- Phase 1.1-1.5 (Foundation) - all tasks can run concurrently once dependencies installed
- Phase 2.1-2.5 (OCR components) - after Phase 1 complete
- Phase 8.1-8.2 (i18n) - can be done anytime, independent of other phases
- Phase 11 (PWA Setup) - can be done in parallel with most phases, only requires Phase 1 complete
- Phase 12.1-12.3 (Testing) - write tests as features are implemented

**Must be sequential**:
- Phase 1 → Phase 2 → Phase 3 → Phase 4 (setup before UI)
- Phase 4 → Phase 5 (scanner view before card list)
- Phase 5 → Phase 6 (card list before edit/delete)
- Phase 7 depends on Phase 3 (store) and Phase 5 (card list)
- Phase 10 (Mobile Camera) depends on Phase 2 (OCR components) and Phase 4 (Scanner View)
- Phase 13 and 14 should be done last (polish and deploy)

---

## Estimated Effort

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| 1 | Foundation & Infrastructure | 2-3 hours |
| 2 | OCR Capture & Processing | 3-4 hours |
| 3 | Data Management (Store) | 2-3 hours |
| 4 | Scanner View UI | 2-3 hours |
| 5 | Card List UI | 3-4 hours |
| 6 | Image Viewer & Edit | 2-3 hours |
| 7 | Export Functionality | 2-3 hours |
| 8 | Internationalization | 1-2 hours |
| 9 | Styling & Responsiveness | 2-3 hours |
| 10 | Mobile Camera Features | 4-6 hours |
| 11 | PWA Setup | 3-4 hours |
| 12 | Testing | 3-4 hours |
| 13 | Accessibility & Performance | 2-3 hours |
| 14 | Documentation & Deployment | 1-2 hours |
| **Total** | **All Phases** | **34-51 hours** |

This is a substantial feature, estimated at **4-6 full working days** for a single developer.

---

## Notes
- Tasks are broken down to be small and verifiable
- Each task has a clear validation criterion
- Tests should be written alongside feature development
- Accessibility should be considered from the start, not as an afterthought
- Internationalization is easier to add early than retrofit later