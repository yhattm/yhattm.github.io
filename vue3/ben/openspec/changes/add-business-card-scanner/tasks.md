# Implementation Tasks

## Phase 1: Foundation & Infrastructure

### 1.1 Install Dependencies
- [ ] Install tesseract.js (`npm install tesseract.js`)
- [ ] Install idb library for IndexedDB (`npm install idb`)
- [ ] Verify TypeScript types are available
- [ ] Update package.json with new dependencies

**Validation**: Run `npm install` successfully, no errors

### 1.2 Create TypeScript Types
- [ ] Create `src/types/business-card.ts` with interfaces:
  - `BusinessCard`
  - `CardImage`
  - `CardData`
  - `OcrResult`
- [ ] Create IndexedDB schema types
- [ ] Export types for use across the application

**Validation**: Types compile without errors, importable in other files

### 1.3 Setup IndexedDB Database
- [ ] Create `src/services/db.ts` for database initialization
- [ ] Define database schema with 'cards' and 'images' stores
- [ ] Create indexes (e.g., 'by-timestamp' on cards)
- [ ] Implement database upgrade logic for versioning
- [ ] Add database utility functions (get, add, update, delete)

**Validation**: Database initializes on first load, stores are created

### 1.4 Create OCR Service
- [ ] Create `src/services/ocr-service.ts` with OCR interface
- [ ] Implement Tesseract.js OCR service
- [ ] Configure Tesseract with English and Chinese language support
- [ ] Add loading/progress tracking for OCR operations
- [ ] Add error handling for OCR failures

**Validation**: OCR service can process test image and return text

### 1.5 Create Image Processing Utilities
- [ ] Create `src/utils/image-processing.ts`
- [ ] Implement image compression function (max 1920x1080, 80% quality)
- [ ] Implement thumbnail generation (max 200x200, 70% quality)
- [ ] Handle different image formats (JPEG, PNG, WebP)
- [ ] Add error handling for image processing failures

**Validation**: Test images are compressed and thumbnails generated correctly

---

## Phase 2: OCR Capture & Processing

### 2.1 Create Field Parser
- [ ] Create `src/utils/field-parser.ts`
- [ ] Implement regex patterns for email, phone, URL detection
- [ ] Implement heuristics for name, title, company extraction
- [ ] Add social media URL detection (LinkedIn, etc.)
- [ ] Add fax number detection
- [ ] Test with sample business card OCR text

**Validation**: Parser correctly extracts fields from test OCR text

### 2.2 Build Camera Capture Component
- [ ] Create `src/components/scanner/CameraCapture.vue`
- [ ] Implement camera permission request
- [ ] Display live camera preview using MediaDevices API
- [ ] Add capture button to take still image
- [ ] Add retake functionality
- [ ] Handle camera permission denied gracefully
- [ ] Add fallback to file upload

**Validation**: Camera opens, displays preview, captures image

### 2.3 Build Image Upload Component
- [ ] Add file input for image upload
- [ ] Support drag-and-drop image upload
- [ ] Validate file type (JPEG, PNG, WebP only)
- [ ] Display selected image preview
- [ ] Show error for invalid file types

**Validation**: Users can upload images via file picker or drag-and-drop

### 2.4 Build OCR Processor Component
- [ ] Create `src/components/scanner/OcrProcessor.vue`
- [ ] Integrate with OCR service
- [ ] Show loading indicator during OCR processing
- [ ] Display OCR progress percentage
- [ ] Handle OCR errors with user-friendly messages
- [ ] Emit OCR results to parent component

**Validation**: OCR processes uploaded/captured images, shows progress

### 2.5 Build Card Form Component
- [ ] Create `src/components/scanner/CardForm.vue`
- [ ] Display editable form with all card fields:
  - Name, Title, Company
  - Phone, Email, Address
  - Website, Social Media, Fax
  - Raw OCR (read-only)
- [ ] Add form validation (email format, phone format)
- [ ] Add save/cancel buttons
- [ ] Emit save event with form data

**Validation**: Form displays OCR-extracted data, allows editing

---

## Phase 3: Data Management (Pinia Store)

### 3.1 Create Business Card Store
- [ ] Create `src/stores/businessCard.ts`
- [ ] Define reactive state: `cards`, `isLoading`, `error`
- [ ] Implement `loadCards()` action to fetch from IndexedDB
- [ ] Implement `addCard()` action to save new card + image
- [ ] Implement `updateCard()` action to modify existing card
- [ ] Implement `deleteCard()` action to remove card + image
- [ ] Implement `exportToJson()` getter for JSON export

**Validation**: Store loads cards, performs CRUD operations successfully

### 3.2 Integrate Store with IndexedDB
- [ ] Connect store actions to database service
- [ ] Handle async operations with proper error handling
- [ ] Update reactive state after database operations
- [ ] Add timestamps (timestamp, lastModified) automatically

**Validation**: Store operations persist to IndexedDB, reload on page refresh

---

## Phase 4: User Interface - Scanner View

### 4.1 Create Main Scanner View
- [ ] Create `src/views/BusinessCardScannerView.vue`
- [ ] Add page header with title and subtitle
- [ ] Integrate CameraCapture component
- [ ] Integrate OcrProcessor component
- [ ] Show scan status/progress
- [ ] Handle OCR completion and display results in CardForm
- [ ] Add bilingual support (i18n)

**Validation**: Scanner view displays, user can capture/upload and see OCR results

### 4.2 Add Scanner to Router
- [ ] Update `src/router/index.ts`
- [ ] Add route: `/business-card-scanner`
- [ ] Configure lazy loading for the view
- [ ] Add route metadata if needed

**Validation**: Navigate to `/business-card-scanner` works

### 4.3 Add Navigation Link
- [ ] Update NavBar or ToolsHomeView to include link to scanner
- [ ] Add appropriate icon for business card scanner
- [ ] Add bilingual labels

**Validation**: Scanner is accessible from navigation

### 4.4 Implement Save Card Flow
- [ ] On CardForm save event, validate data
- [ ] Compress image and generate thumbnail
- [ ] Call store's `addCard()` with card data and image
- [ ] Show success message
- [ ] Clear form and allow new scan
- [ ] Handle save errors gracefully

**Validation**: Scanned cards are saved to IndexedDB

---

## Phase 5: User Interface - Card List

### 5.1 Create Card List Item Component
- [ ] Create `src/components/scanner/CardListItem.vue`
- [ ] Display card thumbnail
- [ ] Show preview: name, title, company, scan timestamp
- [ ] Add View, Edit, Delete action buttons
- [ ] Format timestamp in localized format
- [ ] Handle missing fields gracefully

**Validation**: Card list item displays card preview correctly

### 5.2 Create Card List Component
- [ ] Create `src/components/scanner/CardList.vue`
- [ ] Display all cards from store
- [ ] Sort cards by timestamp (newest first)
- [ ] Show empty state when no cards
- [ ] Show card count in header
- [ ] Integrate CardListItem for each card

**Validation**: Card list displays all saved cards

### 5.3 Implement Card List View
- [ ] Add card list section to BusinessCardScannerView
- [ ] Or create separate route `/business-card-scanner/cards` (optional)
- [ ] Load cards on mount using store
- [ ] Show loading state while loading
- [ ] Handle errors (failed to load)

**Validation**: Users can see all their saved cards

### 5.4 Add Search/Filter Functionality
- [ ] Add search input to card list
- [ ] Filter cards by text (name, company, email, phone)
- [ ] Update list reactively as user types
- [ ] Show "no results" message when filter returns nothing
- [ ] Add clear search button

**Validation**: Search filters card list correctly

### 5.5 Add Sorting Options
- [ ] Add sort dropdown/buttons
- [ ] Implement sort by date (default)
- [ ] Implement sort by name
- [ ] Implement sort by company
- [ ] Update card list when sort changes

**Validation**: Cards can be sorted by different criteria

---

## Phase 6: User Interface - Image Viewer & Edit

### 6.1 Create Image Viewer Component
- [ ] Create `src/components/scanner/ImageViewer.vue`
- [ ] Display full-size image in modal
- [ ] Add zoom in/out controls
- [ ] Add close button and ESC key support
- [ ] Click outside to close
- [ ] Prevent body scroll when modal open
- [ ] Add keyboard navigation (arrow keys for next/prev if multiple)

**Validation**: Clicking thumbnail opens full-size image viewer

### 6.2 Implement Edit Card Flow
- [ ] On Edit action, open CardForm with existing data
- [ ] Load full card data from store
- [ ] Populate form fields
- [ ] On save, call store's `updateCard()`
- [ ] Update lastModified timestamp
- [ ] Show success message
- [ ] Refresh card list

**Validation**: Users can edit card data and save changes

### 6.3 Implement Delete Card Flow
- [ ] On Delete action, show confirmation dialog
- [ ] Warn user deletion is permanent
- [ ] On confirm, call store's `deleteCard()`
- [ ] Remove card from list
- [ ] Show success message
- [ ] Handle errors (e.g., card not found)

**Validation**: Users can delete cards with confirmation

---

## Phase 7: Export Functionality

### 7.1 Create Export Dialog Component
- [ ] Create `src/components/scanner/ExportDialog.vue`
- [ ] Display export preview (first few lines of JSON)
- [ ] Show count of cards to export
- [ ] Add "Download" button
- [ ] Add "Copy to Clipboard" button
- [ ] Add "Cancel" button
- [ ] Handle modal open/close

**Validation**: Export dialog displays and shows correct preview

### 7.2 Implement JSON Export
- [ ] In store, implement `exportToJson()` method
- [ ] Serialize cards to JSON (exclude image blobs, keep imageIds)
- [ ] Pretty-print JSON with 2-space indentation
- [ ] Add metadata (export timestamp, count)

**Validation**: Export generates valid JSON

### 7.3 Implement Download Functionality
- [ ] Create download utility function
- [ ] Generate filename with timestamp (business-cards-YYYY-MM-DD-HHmmss.json)
- [ ] Create Blob and trigger download
- [ ] Show success message
- [ ] Handle download errors

**Validation**: Users can download JSON file

### 7.4 Implement Copy to Clipboard
- [ ] Use Clipboard API to copy JSON string
- [ ] Show success feedback (toast or button state change)
- [ ] Handle clipboard permission issues
- [ ] Provide fallback if Clipboard API unavailable

**Validation**: Users can copy JSON to clipboard

### 7.5 Add Export All Button
- [ ] Add "Export All" button to card list header
- [ ] On click, open export dialog with all cards
- [ ] Pass all cards to export dialog

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
- [ ] Update `src/locales/en.json`
- [ ] Add translations for:
  - Scanner page title, subtitle, instructions
  - Form field labels
  - Button labels (Capture, Upload, Save, Edit, Delete, Export)
  - Status messages (scanning, success, errors)
  - Empty states
- [ ] Add error messages

**Validation**: All text renders correctly in English

### 8.2 Add Chinese Translations
- [ ] Update `src/locales/zh.json`
- [ ] Add Chinese translations for all English keys
- [ ] Ensure proper Traditional Chinese characters
- [ ] Test date/time formatting in Chinese

**Validation**: All text renders correctly in Chinese, switching languages works

---

## Phase 9: Styling & Responsiveness

### 9.1 Style Scanner View
- [ ] Apply Tailwind CSS classes for layout
- [ ] Use shadcn-vue components (Card, Button, Input, etc.)
- [ ] Ensure consistent spacing and alignment
- [ ] Add hover/focus states
- [ ] Support light and dark themes

**Validation**: Scanner view looks good in both themes

### 9.2 Style Card List
- [ ] Create responsive grid layout (1 col mobile, 2-3 cols desktop)
- [ ] Style card list items with shadcn Card component
- [ ] Ensure thumbnails are properly sized
- [ ] Add loading skeletons
- [ ] Test on mobile, tablet, desktop

**Validation**: Card list is responsive and visually appealing

### 9.3 Style Modal Dialogs
- [ ] Style image viewer modal
- [ ] Style export dialog
- [ ] Style confirmation dialogs
- [ ] Ensure modals work on mobile (fullscreen or adaptive)
- [ ] Test modal backdrop and close behavior

**Validation**: Modals look good and function well on all devices

---

## Phase 10: Mobile Camera Features

### 10.1 Implement getUserMedia Camera Access
- [ ] Create `src/composables/useCamera.ts` composable
- [ ] Check browser support for `navigator.mediaDevices.getUserMedia`
- [ ] Request video stream with `facingMode: 'environment'` (rear camera)
- [ ] Handle camera permission requests and denials
- [ ] Provide fallback to HTML5 `<input capture="environment">`
- [ ] Stop camera stream properly on component unmount

**Validation**: Camera opens with rear camera on mobile devices

### 10.2 Build Live Camera Preview
- [ ] Create video element for camera preview
- [ ] Set proper aspect ratio (4:3 or 16:9)
- [ ] Mirror preview for front camera, don't mirror for rear
- [ ] Add camera controls overlay (capture, flash, focus, switch)
- [ ] Position controls for easy thumb access on mobile
- [ ] Handle orientation changes gracefully

**Validation**: Live preview displays with proper controls overlay

### 10.3 Implement Flash/Torch Control
- [ ] Check torch capability via `track.getCapabilities().torch`
- [ ] Add flash toggle button (show only if supported)
- [ ] Toggle torch on/off via `applyConstraints({ advanced: [{ torch: true }] })`
- [ ] Update button icon to reflect current state
- [ ] Handle torch not supported gracefully

**Validation**: Flash toggles on supported devices, hidden on others

### 10.4 Implement Auto-Focus Control
- [ ] Enable continuous auto-focus by default (`focusMode: 'continuous'`)
- [ ] Add tap-to-focus functionality on preview
- [ ] Show focus indicator animation at tap location
- [ ] Add manual/continuous focus mode toggle button
- [ ] Provide visual feedback for focus confirmation

**Validation**: Camera focuses automatically and responds to taps

### 10.5 Implement Camera Switching
- [ ] Enumerate available video devices
- [ ] Show camera switch button only if multiple cameras exist
- [ ] Switch between front (`facingMode: 'user'`) and rear (`facingMode: 'environment'`)
- [ ] Stop current stream before requesting new camera
- [ ] Update preview mirroring based on active camera

**Validation**: Can switch between front and rear cameras

### 10.6 Capture Still Image from Stream
- [ ] Draw current video frame to canvas element
- [ ] Convert canvas to Blob in JPEG format (quality: 0.9)
- [ ] Pause or stop video stream after capture
- [ ] Display captured image for review
- [ ] Provide "Use This Image" and "Retake" buttons

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
- [ ] Create tab component with "Camera" and "Upload" tabs
- [ ] Default to Camera tab on mobile, Upload tab on desktop
- [ ] Stop camera stream when switching to Upload tab
- [ ] Initialize camera when switching to Camera tab
- [ ] Remember last selected tab (optional)

**Validation**: Tab switching works smoothly, camera released properly

### 10.12 Optimize for Mobile UI
- [ ] Ensure minimum 44x44px touch targets for all buttons
- [ ] Add adequate spacing between buttons
- [ ] Position buttons for comfortable thumb reach
- [ ] Add haptic feedback for button presses (if supported)
- [ ] Implement full-screen camera mode

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