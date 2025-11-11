# mobile-camera-features Specification

## Purpose
Provides advanced mobile camera capabilities using the MediaDevices API for enhanced business card scanning on mobile devices.

提供使用 MediaDevices API 的進階行動相機功能，以增強行動裝置上的名片掃描功能。

## ADDED Requirements

### Requirement: getUserMedia Camera Access
The application MUST use the MediaDevices.getUserMedia() API for advanced camera control on supported devices.

#### Scenario: Check getUserMedia support
**Given** the user opens the camera tab on a mobile device
**When** the camera component initializes
**Then** the application checks if `navigator.mediaDevices.getUserMedia` is available
**And** if supported, the advanced camera mode is enabled
**And** if not supported, falls back to HTML5 file input with capture attribute

#### Scenario: Request camera with rear camera preference
**Given** getUserMedia is supported
**When** the user activates the camera
**Then** the application requests video stream with `facingMode: 'environment'`
**And** the rear camera is preferred for scanning
**And** permission prompt is shown to the user

#### Scenario: Camera permission granted
**Given** the user grants camera permission
**When** the media stream is obtained
**Then** the live video feed is displayed in the preview area
**And** the video element shows the camera stream
**And** camera controls become available

#### Scenario: Camera permission denied
**Given** the user denies camera permission
**When** the permission request is rejected
**Then** an informative error message is displayed
**And** instructions to enable camera in browser settings are shown
**And** the upload tab is suggested as an alternative

### Requirement: Live Camera Preview
The application MUST display a live camera preview with proper aspect ratio and controls.

#### Scenario: Display live preview
**Given** the camera stream is active
**When** the preview is rendered
**Then** the video element fills the available space
**And** the aspect ratio is maintained (4:3 or 16:9)
**And** the preview is mirrored if using front camera
**And** the preview is not mirrored if using rear camera

#### Scenario: Preview controls overlay
**Given** the camera preview is showing
**When** the user views the interface
**Then** camera controls are overlaid on the preview
**And** controls include: Capture button, Flash toggle, Focus toggle, Camera switch
**And** controls have clear icons and labels
**And** controls are positioned for easy thumb access on mobile

### Requirement: Flash/Torch Control
The application MUST provide flash/torch control for low-light card scanning.

#### Scenario: Check flash availability
**Given** the camera is active
**When** the camera capabilities are queried
**Then** the application checks if torch is supported via `track.getCapabilities().torch`
**And** if supported, the flash toggle button is enabled
**And** if not supported, the flash toggle is hidden or disabled

#### Scenario: Toggle flash on
**Given** the flash is supported and currently off
**When** the user taps the flash toggle button
**Then** the torch is enabled via `track.applyConstraints({ advanced: [{ torch: true }] })`
**And** the flash icon changes to indicate "on" state
**And** the preview brightens with the torch light

#### Scenario: Toggle flash off
**Given** the flash is currently on
**When** the user taps the flash toggle button
**Then** the torch is disabled via `track.applyConstraints({ advanced: [{ torch: false }] })`
**And** the flash icon changes to indicate "off" state
**And** the torch light turns off

### Requirement: Auto-Focus Control
The application MUST support auto-focus for sharp business card images.

#### Scenario: Continuous auto-focus
**Given** the camera supports auto-focus
**When** the camera stream is active
**Then** continuous auto-focus is enabled by default via `focusMode: 'continuous'`
**And** the camera automatically adjusts focus as the card moves
**And** focus feedback is visible in the preview

#### Scenario: Manual focus trigger
**Given** the camera supports focus
**When** the user taps on the preview area
**Then** the camera attempts to focus on that point
**And** a focus indicator animation is shown at the tap location
**And** focus confirmation is provided visually

#### Scenario: Focus mode toggle
**Given** the camera supports multiple focus modes
**When** the user taps the focus toggle button
**Then** focus mode switches between continuous and manual
**And** the button icon reflects the current focus mode
**And** a brief message explains the current mode

### Requirement: Camera Switching
The application MUST allow switching between front and rear cameras.

#### Scenario: Detect multiple cameras
**Given** the device has multiple cameras
**When** the camera component initializes
**Then** the application enumerates available video devices
**And** determines if camera switching is available
**And** shows camera switch button if multiple cameras exist

#### Scenario: Switch to front camera
**Given** the rear camera is currently active
**When** the user taps the camera switch button
**Then** the current stream is stopped
**And** a new stream is requested with `facingMode: 'user'`
**And** the front camera preview is displayed
**And** preview is mirrored for selfie mode

#### Scenario: Switch to rear camera
**Given** the front camera is currently active
**When** the user taps the camera switch button
**Then** the current stream is stopped
**And** a new stream is requested with `facingMode: 'environment'`
**And** the rear camera preview is displayed
**And** preview mirroring is disabled

### Requirement: Image Capture from Stream
The application MUST capture still images from the live camera stream.

#### Scenario: Capture still image
**Given** the camera preview is active
**When** the user taps the capture button
**Then** the current video frame is drawn to a canvas element
**And** the canvas is converted to a Blob in JPEG format
**And** the captured image is prepared for OCR processing
**And** camera stream is paused or stopped

#### Scenario: Preview captured image
**Given** an image has been captured
**When** the capture completes
**Then** the captured image is displayed in place of live preview
**And** the user can review the image quality
**And** "Use This Image" and "Retake" buttons are shown

#### Scenario: Retake image
**Given** a captured image is being previewed
**When** the user taps the "Retake" button
**Then** the captured image is discarded
**And** the live camera preview resumes
**And** capture controls are shown again

#### Scenario: Confirm captured image
**Given** a captured image is being previewed
**When** the user taps the "Use This Image" button
**Then** the image proceeds to OCR processing
**And** the camera stream is released
**And** the camera tab shows processing status

### Requirement: Image Rotation and Cropping
The application MUST provide tools to rotate and crop captured images before OCR.

#### Scenario: Rotate image
**Given** a captured image is being previewed
**When** the user taps the rotate button
**Then** the image rotates 90 degrees clockwise
**And** the rotation can be applied multiple times
**And** the final orientation is remembered for OCR processing

#### Scenario: Crop tool activation
**Given** a captured image is displayed
**When** the user taps the crop button
**Then** a cropping overlay is shown with adjustable handles
**And** the user can drag corners to define crop area
**And** a highlight shows the area that will be kept

#### Scenario: Apply crop
**Given** the crop tool is active with a defined area
**When** the user confirms the crop
**Then** the image is cropped to the selected area
**And** the cropped image replaces the original
**And** the crop tool is dismissed

#### Scenario: Cancel crop
**Given** the crop tool is active
**When** the user cancels the crop
**Then** the crop area is discarded
**And** the original image is preserved
**And** the crop tool is dismissed

### Requirement: Touch Gestures for Zoom and Pan
The application MUST support touch gestures for examining captured images.

#### Scenario: Pinch to zoom
**Given** a captured image is displayed
**When** the user performs a pinch gesture on the image
**Then** the image zooms in or out based on pinch direction
**And** zoom level is constrained between 1x and 4x
**And** the zoomed image maintains quality

#### Scenario: Pan zoomed image
**Given** an image is zoomed beyond 1x
**When** the user drags with one finger
**Then** the image pans to reveal different areas
**And** panning is constrained to image bounds
**And** momentum scrolling is applied for smooth movement

#### Scenario: Double tap to zoom
**Given** an image is displayed at normal size
**When** the user double-taps the image
**Then** the image zooms to 2x at the tap location
**When** the user double-taps again
**Then** the image returns to normal size

#### Scenario: Reset zoom
**Given** an image is zoomed and/or panned
**When** the user taps the "Reset" button
**Then** the image returns to original size and position
**And** zoom level is set to 1x
**And** pan offset is reset to zero

### Requirement: Orientation Detection
The application MUST detect and handle device orientation changes.

#### Scenario: Detect orientation change
**Given** the camera is active or an image is displayed
**When** the device orientation changes
**Then** the application detects the orientation via `window.orientation` or Screen Orientation API
**And** the UI layout adjusts accordingly
**And** camera preview rotates to match new orientation

#### Scenario: Auto-rotate captured image
**Given** an image is captured in non-standard orientation
**When** the image is processed
**Then** EXIF orientation data is read if available
**And** the image is automatically rotated to correct orientation
**And** the rotation is applied before OCR processing

#### Scenario: Lock orientation during capture
**Given** the user is positioning the camera to capture
**When** capture mode is active
**Then** screen orientation can optionally be locked to prevent accidental rotation
**And** the lock is released after capture completes

### Requirement: Tabbed Interface
The application MUST provide a tabbed interface to switch between Camera and Upload modes.

#### Scenario: Display tabs
**Given** the user is on the business card scanner page
**When** the page loads
**Then** two tabs are visible: "Camera" and "Upload"
**And** the "Camera" tab is selected by default on mobile devices
**And** the "Upload" tab is selected by default on desktop devices

#### Scenario: Switch to Upload tab
**Given** the Camera tab is active
**When** the user taps the Upload tab
**Then** the camera stream is stopped and released
**And** the upload interface is displayed
**And** the Upload tab is visually marked as active

#### Scenario: Switch to Camera tab
**Given** the Upload tab is active
**When** the user taps the Camera tab
**Then** camera initialization begins
**And** the camera preview is displayed
**And** the Camera tab is visually marked as active

#### Scenario: Tab state persistence
**Given** the user switches between tabs
**When** they navigate away and return
**Then** the previously selected tab is remembered
**And** the tab selection persists across page reloads (if desired)

### Requirement: Responsive Mobile UI
The application MUST optimize camera controls for mobile touch interaction.

#### Scenario: Large touch targets
**Given** the camera controls are displayed on mobile
**When** the user views the interface
**Then** all buttons have minimum 44x44 pixel touch targets
**And** buttons are spaced adequately to prevent mis-taps
**And** buttons are positioned for comfortable thumb reach

#### Scenario: Haptic feedback
**Given** the device supports haptic feedback
**When** the user interacts with camera controls
**Then** tactile feedback is provided for button presses
**And** different vibration patterns indicate different actions (capture, error, success)

#### Scenario: Full-screen camera mode
**Given** the camera is active on mobile
**When** the user taps the full-screen button
**Then** the camera preview expands to fill the entire viewport
**And** navigation UI is hidden for distraction-free scanning
**And** a "Exit Full Screen" button is provided

## MODIFIED Requirements
None - this is a new capability enhancing ocr-capture.

## REMOVED Requirements
None - this is a new capability.
