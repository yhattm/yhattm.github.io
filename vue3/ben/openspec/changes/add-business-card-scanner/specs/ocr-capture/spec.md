# ocr-capture Specification

## Purpose
Provides optical character recognition (OCR) capabilities for capturing and processing business card images via camera or file upload.

提供光學字符識別 (OCR) 功能，透過相機或檔案上傳來擷取和處理名片圖片。

## ADDED Requirements

### Requirement: Camera Access
The application MUST provide camera access for capturing business card images.

#### Scenario: Request camera permission
**Given** the user navigates to the business card scanner page
**When** they click the "Open Camera" button
**Then** the browser requests camera permission
**And** the permission dialog explains why camera access is needed

#### Scenario: Display camera preview
**Given** the user has granted camera permission
**When** the camera is activated
**Then** they see a live camera preview
**And** the preview shows the camera feed in real-time
**And** the preview area is properly sized for card capture

#### Scenario: Camera permission denied
**Given** the user clicks "Open Camera"
**When** they deny camera permission
**Then** they see a helpful error message
**And** the upload option is suggested as an alternative
**And** they can still use the file upload feature

### Requirement: Image Upload
The application MUST allow users to upload business card images from their device.

#### Scenario: Upload via file input
**Given** the user is on the scanner page
**When** they click the "Upload Image" button
**Then** a file picker dialog opens
**And** they can select image files (JPEG, PNG, WebP)
**And** the selected image is loaded for processing

#### Scenario: Drag and drop upload
**Given** the user has an image file
**When** they drag the file over the upload area
**Then** the upload area shows a visual indicator
**When** they drop the file
**Then** the image is loaded for processing

#### Scenario: Invalid file type
**Given** the user tries to upload a non-image file
**When** the file is selected
**Then** an error message is shown
**And** the file is rejected
**And** supported formats are listed

### Requirement: Image Capture
The application MUST capture still images from the camera for OCR processing.

#### Scenario: Capture button availability
**Given** the camera preview is active
**When** the user views the interface
**Then** they see a "Capture" button
**And** the button is clearly visible and accessible

#### Scenario: Successful image capture
**Given** the camera preview is active
**When** the user clicks the "Capture" button
**Then** a still image is captured from the camera feed
**And** the camera preview is paused or replaced with the captured image
**And** the image is prepared for OCR processing

#### Scenario: Retake option
**Given** the user has captured an image
**When** they are not satisfied with the capture
**Then** they can click a "Retake" button
**And** the camera preview becomes active again

### Requirement: OCR Processing
The application MUST process images using Tesseract.js to extract text.

#### Scenario: OCR initialization
**Given** the user captures or uploads an image
**When** OCR processing begins
**Then** Tesseract.js worker is initialized (if not already loaded)
**And** a loading indicator is shown
**And** the user is informed processing is in progress

#### Scenario: Successful OCR extraction
**Given** an image is being processed
**When** Tesseract.js completes recognition
**Then** the raw OCR text is extracted
**And** the text is returned for field parsing
**And** processing status is updated to complete

#### Scenario: OCR with language support
**Given** an image contains English and Chinese text
**When** OCR processing runs
**Then** Tesseract.js uses both English and Chinese language models
**And** text in both languages is recognized

#### Scenario: OCR processing error
**Given** an image is being processed
**When** Tesseract.js encounters an error
**Then** the user sees an error message
**And** the error message suggests trying a different image
**And** the user can retry or cancel

#### Scenario: OCR processing progress
**Given** OCR is processing an image
**When** processing is underway
**Then** the user sees a progress indicator
**And** the indicator shows approximate completion percentage
**And** the UI remains responsive

### Requirement: Field Extraction
The application MUST parse OCR text into structured contact fields.

#### Scenario: Extract email address
**Given** OCR text contains an email address
**When** field extraction runs
**Then** the email is identified using regex pattern matching
**And** the email is populated in the email field

#### Scenario: Extract phone number
**Given** OCR text contains a phone number
**When** field extraction runs
**Then** the phone number is identified
**And** multiple formats are supported (with/without country code, various separators)
**And** the first detected phone number is used

#### Scenario: Extract website URL
**Given** OCR text contains a website URL
**When** field extraction runs
**Then** HTTP/HTTPS URLs are identified
**And** the URL is populated in the website field

#### Scenario: Extract name from first line
**Given** OCR text has multiple lines
**When** field extraction runs
**Then** the first non-empty line is assumed to be the name
**And** the name field is populated

#### Scenario: Extract company information
**Given** OCR text contains company name
**When** field extraction runs
**Then** the company name is extracted using heuristics
**And** the company field is populated

#### Scenario: Extract social media handles
**Given** OCR text contains LinkedIn URL or other social media
**When** field extraction runs
**Then** social media URLs are identified
**And** the socialMedia field is populated

#### Scenario: Store raw OCR text with layout preservation
**Given** OCR processing completes
**When** fields are extracted
**Then** the complete raw OCR text is preserved with original line breaks and spacing
**And** the raw text maintains the ASCII string layout representing the business card's visual arrangement
**And** the raw text is stored alongside structured fields
**And** users can view the raw text for reference

#### Scenario: Display raw OCR text with layout
**Given** a business card has been scanned with OCR
**When** the user views the card details or editing form
**Then** the raw OCR text is displayed in a monospace font
**And** line breaks and whitespace are preserved (`white-space: pre-wrap` or similar)
**And** the text layout visually represents the business card's original arrangement
**And** users can easily identify OCR recognition errors by comparing layout to the original image
**And** users can detect if image rotation affected recognition quality by observing text orientation in the raw output

### Requirement: Image Preprocessing
The application MUST optimize images before OCR processing for better accuracy.

#### Scenario: Image compression
**Given** a high-resolution image is captured or uploaded
**When** the image is prepared for OCR
**Then** the image is resized if larger than 1920x1080
**And** image quality is maintained for OCR accuracy
**And** file size is reduced for performance

#### Scenario: Image format conversion
**Given** an image in any supported format
**When** preparing for OCR
**Then** the image is converted to a format suitable for Tesseract.js
**And** the conversion preserves text clarity

### Requirement: Region-Based OCR for Improved Recognition
The application MUST support cropping different regions of the business card image to improve OCR accuracy through manual and automatic region selection.

#### Scenario: Multi-region OCR processing
**Given** a business card image has been captured or uploaded
**When** OCR processing is initiated
**Then** the image MAY be divided into logical regions (e.g., top, middle, bottom sections)
**And** OCR is performed on each region independently
**And** results from all regions are combined
**And** the combined results provide better overall recognition accuracy

#### Scenario: Manual region selection for OCR
**Given** the user has captured a business card image
**When** initial OCR results have low confidence or missing fields
**Then** the user can optionally select a specific region of the image to re-scan
**And** a cropping tool allows the user to define the region boundaries
**And** OCR is re-run on only the selected region
**And** extracted data from the region updates the corresponding fields

#### Scenario: Automatic region detection
**Given** a business card image is being processed
**When** the preprocessing stage analyzes the image
**Then** the system MAY detect distinct text regions using contrast and edge detection
**And** high-contrast regions with dense text are prioritized for OCR
**And** each detected region is processed with optimized parameters
**And** region-specific results are merged intelligently

#### Scenario: Re-scan with different crop for failed recognition
**Given** initial full-image OCR produces poor results (low confidence < 50%)
**When** the system detects low recognition quality
**Then** the system MAY automatically retry OCR with alternative cropping strategies
**And** different crop regions are tested (e.g., excluding borders, focusing on center)
**And** the best-performing crop result is selected
**And** the user is informed if recognition improved with cropping

**Rationale**:
- Business cards often have complex backgrounds, borders, or logos that interfere with OCR
- Focusing on specific text-dense regions can significantly improve recognition accuracy
- Different regions may benefit from different OCR parameters (e.g., contrast adjustment)
- Users can manually refine OCR by re-scanning problematic areas

### Requirement: Extensible OCR Architecture
The application MUST be designed to support multiple OCR providers.

#### Scenario: OCR service interface
**Given** the codebase includes OCR functionality
**When** developers review the code
**Then** they find an abstract OCR service interface
**And** Tesseract.js implements this interface
**And** other OCR providers can be added by implementing the same interface

#### Scenario: Switch OCR provider
**Given** a new OCR provider is implemented
**When** the provider is registered
**Then** the application can use the new provider
**And** no changes to UI components are required
**And** the same data structure is returned

## MODIFIED Requirements

### Requirement: Raw OCR Text Display with Layout Preservation
The raw OCR text MUST be displayed with preserved formatting to help users identify recognition errors and image orientation issues.

**Changed from**: Raw OCR text displayed in basic textarea without specific layout preservation
**Changed to**: Raw OCR text displayed with monospace font and `white-space: pre-wrap` to preserve ASCII layout

**Rationale**:
- Helps users quickly identify OCR recognition errors by comparing text layout with original card image
- Makes image rotation issues obvious (e.g., if text appears sideways or upside down in raw output)
- Provides visual debugging aid for OCR quality assessment
- Preserves spatial relationship between text elements as they appeared on the card

#### Scenario: Enhanced raw text visualization for error detection
**Given** a business card has been scanned
**When** the user views the raw OCR text
**Then** the text is displayed in a monospace font (e.g., `font-family: monospace`)
**And** whitespace and line breaks are preserved using `white-space: pre-wrap` or equivalent
**And** the text layout mirrors the visual arrangement on the business card
**And** users can immediately spot recognition errors by layout misalignment
**And** rotated or misoriented images produce visibly abnormal text arrangements

#### Scenario: Side-by-side comparison with image
**Given** the user is editing a scanned business card
**When** viewing both the card image and raw OCR text
**Then** the text layout approximately matches the spatial arrangement in the image
**And** fields appearing on the left side of the card appear in the left portion of the text
**And** top-to-bottom reading order is preserved
**And** discrepancies suggest OCR errors or rotation issues

**Impact**:
- Requires `white-space: pre-wrap` CSS on raw OCR text display elements
- Monospace font already applied (`font-mono` class) but needs verification
- No changes to OCR processing or data storage
- Enhanced user experience for troubleshooting OCR quality

## REMOVED Requirements
None - this is a new capability.