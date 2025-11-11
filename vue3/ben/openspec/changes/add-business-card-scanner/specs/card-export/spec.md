# card-export Specification

## Purpose
Enables users to export their business card data in JSON format for backup, sharing, or external processing.

讓使用者能夠以 JSON 格式匯出名片資料，用於備份、分享或外部處理。

## ADDED Requirements

### Requirement: JSON Export Format
The application MUST export card data in well-formatted JSON.

#### Scenario: JSON structure
**Given** cards are exported to JSON
**When** the JSON is examined
**Then** it follows a consistent structure
**And** the structure includes:
  - Array of card objects
  - Each card has all fields (id, timestamp, data, rawOcr, lastModified)
  - Timestamps are in Unix format (milliseconds)
  - Missing fields are included as null or empty strings
**And** the JSON is valid and parseable

#### Scenario: Pretty-printed JSON
**Given** JSON export is generated
**When** the JSON is viewed
**Then** it is formatted with proper indentation (2 spaces)
**And** the JSON is human-readable
**And** field names are descriptive

#### Scenario: Exclude binary data
**Given** cards with images are exported
**When** the JSON is generated
**Then** image blobs are not included in the export
**And** image IDs are included for reference
**And** a note explains that images are stored separately

### Requirement: Export All Cards
Users MUST be able to export all their saved cards at once.

#### Scenario: Export all button
**Given** the user has saved cards
**When** they view the card list or export dialog
**Then** an "Export All" button is available
**And** the button is clearly labeled
**And** clicking it initiates the export process

#### Scenario: Export all success
**Given** the user clicks "Export All"
**When** the export completes
**Then** JSON containing all cards is generated
**And** the user is presented with download and copy options
**And** a success message confirms the number of cards exported

#### Scenario: Export with no cards
**Given** the user has no saved cards
**When** they attempt to export all
**Then** an empty array JSON is generated
**Or** a message informs them there's nothing to export
**And** the export process doesn't fail

### Requirement: Export Selected Cards
Users MUST be able to export only specific cards they've selected.

#### Scenario: Export selected button
**Given** the user has selected one or more cards
**When** they view the export options
**Then** an "Export Selected" button is available
**And** the button shows the count of selected cards
**And** clicking it exports only the selected cards

#### Scenario: Export selected success
**Given** the user has selected 3 cards and clicks "Export Selected"
**When** the export completes
**Then** JSON containing exactly 3 cards is generated
**And** the cards in the export match the selected cards
**And** the order is preserved

#### Scenario: Export with no selection
**Given** multi-select mode is active
**When** the user tries to export with no cards selected
**Then** a message prompts them to select at least one card
**And** the export process doesn't proceed

### Requirement: Download JSON File
Users MUST be able to download exported JSON as a file.

#### Scenario: Download button
**Given** JSON export has been generated
**When** the user views export options
**Then** a "Download" or "Download JSON" button is available
**And** the button is clearly labeled

#### Scenario: Initiate download
**Given** the user clicks "Download"
**When** the download is triggered
**Then** a JSON file is downloaded to their device
**And** the browser's download mechanism is used
**And** a success message confirms the download

#### Scenario: File naming
**Given** a JSON file is downloaded
**When** the file is saved
**Then** the filename includes a timestamp
**And** the format is "business-cards-YYYY-MM-DD-HHmmss.json"
**And** the filename is URL-safe and filesystem-compatible

#### Scenario: File content
**Given** a downloaded JSON file
**When** the file is opened
**Then** it contains valid, pretty-printed JSON
**And** the content matches the exported data
**And** the file can be re-imported or processed externally

### Requirement: Copy to Clipboard
Users MUST be able to copy exported JSON to their clipboard.

#### Scenario: Copy button
**Given** JSON export has been generated
**When** the user views export options
**Then** a "Copy to Clipboard" button is available
**And** the button has a clear icon and label

#### Scenario: Copy to clipboard success
**Given** the user clicks "Copy to Clipboard"
**When** the copy operation executes
**Then** the JSON string is copied to the system clipboard
**And** a success message or toast notification appears
**And** the user can paste the JSON elsewhere

#### Scenario: Copy feedback
**Given** the user has copied JSON to clipboard
**When** the copy succeeds
**Then** visual feedback confirms the copy (e.g., button changes to "Copied!")
**And** the feedback is temporary (reverts after 2-3 seconds)

#### Scenario: Clipboard API unavailable
**Given** the browser doesn't support Clipboard API
**When** the user tries to copy
**Then** a fallback method is used (e.g., select text and Ctrl+C prompt)
**Or** a message explains clipboard access is not available
**And** the user can still download the JSON

### Requirement: Export Dialog UI
The application MUST provide a dedicated export dialog.

#### Scenario: Open export dialog
**Given** the user wants to export cards
**When** they click an "Export" button
**Then** a modal dialog opens
**And** the dialog shows export options clearly
**And** the dialog includes preview of export data

#### Scenario: Export preview
**Given** the export dialog is open
**When** the user views the dialog
**Then** they see a preview of the JSON (first few lines)
**And** the preview includes the number of cards
**And** the preview helps them confirm what will be exported

#### Scenario: Choose export method
**Given** the export dialog is open
**When** the user reviews options
**Then** they can choose between Download and Copy to Clipboard
**And** both options are clearly explained
**And** they can cancel the export

#### Scenario: Close export dialog
**Given** the export dialog is open
**When** the user clicks Cancel, Close, or outside the dialog
**Then** the dialog closes without exporting
**And** focus returns to the card list

### Requirement: Export Metadata
The export MUST include metadata about the export itself.

#### Scenario: Export metadata header
**Given** JSON export is generated
**When** the export is examined
**Then** it includes metadata such as:
  - Export timestamp
  - Number of cards exported
  - Application version (if applicable)
**And** metadata is in a separate field or at the top of the JSON

### Requirement: Export Error Handling
The application MUST handle export errors gracefully.

#### Scenario: Export generation fails
**Given** an error occurs while generating export
**When** the error is detected
**Then** an error message is displayed to the user
**And** the error message explains what went wrong
**And** the user can retry or cancel

#### Scenario: Download fails
**Given** the JSON file download fails
**When** the failure is detected
**Then** an error message is shown
**And** the user can retry the download
**And** they can still try copying to clipboard as alternative

#### Scenario: Clipboard copy fails
**Given** copying to clipboard fails
**When** the failure is detected
**Then** an error message is shown
**And** the user is offered the download option instead
**And** they can retry the copy

### Requirement: Accessibility
Export features MUST be accessible to all users.

#### Scenario: Keyboard access
**Given** the export dialog is open
**When** a keyboard-only user interacts with it
**Then** they can tab through all options
**And** they can activate buttons with Enter or Space
**And** they can close the dialog with ESC

#### Scenario: Screen reader support
**Given** a screen reader user accesses export features
**When** they navigate the export dialog
**Then** all options are properly announced
**And** the number of cards to export is announced
**And** success/error messages are announced

#### Scenario: Focus management
**Given** the export dialog opens
**When** it appears
**Then** focus is moved to the dialog
**And** focus is trapped within the dialog
**When** the dialog closes
**Then** focus returns to the element that opened it

## MODIFIED Requirements
None - this is a new capability.

## REMOVED Requirements
None - this is a new capability.