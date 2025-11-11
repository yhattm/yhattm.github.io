# card-data-management Specification

## Purpose
Manages persistent storage, retrieval, and manipulation of scanned business card data and images using IndexedDB.

使用 IndexedDB 管理已掃描名片資料和圖片的持久化儲存、檢索和操作。

## ADDED Requirements

### Requirement: IndexedDB Storage
The application MUST use IndexedDB to store business card data and images.

#### Scenario: Initialize database
**Given** the user first visits the business card scanner
**When** the application loads
**Then** IndexedDB database is created if it doesn't exist
**And** database schema includes 'cards' and 'images' object stores
**And** appropriate indexes are created

#### Scenario: Database version management
**Given** the database schema needs to be updated
**When** a new version is deployed
**Then** the database is upgraded automatically
**And** existing data is migrated to new schema
**And** users experience no data loss

### Requirement: Card Data Storage
The application MUST persist business card data with all extracted fields.

#### Scenario: Save new card
**Given** a business card has been successfully scanned
**When** the user confirms saving the card
**Then** a new card record is created in IndexedDB
**And** the card includes a unique ID (UUID)
**And** the card includes a timestamp of when it was scanned
**And** all extracted fields are stored
**And** a reference to the associated image is stored

#### Scenario: Card data structure
**Given** a card is stored in the database
**When** the card record is examined
**Then** it contains the following fields:
  - id (string, UUID)
  - timestamp (number, Unix timestamp)
  - imageId (string, reference to image)
  - data object with: name, title, company, phone, email, address, website, socialMedia, fax
  - rawOcr (string, original OCR text)
  - lastModified (number, Unix timestamp)

#### Scenario: Handle missing fields
**Given** OCR extraction couldn't identify certain fields
**When** the card is saved
**Then** missing fields are stored as undefined or empty strings
**And** the card is still valid and can be saved
**And** users can manually add the missing information later

### Requirement: Image Storage
The application MUST store both full-size and thumbnail versions of card images.

#### Scenario: Store compressed image
**Given** an image has been captured or uploaded
**When** the card is saved
**Then** the image is compressed to maximum 1920x1080
**And** JPEG format is used with 80% quality
**And** the compressed image is stored as a Blob in IndexedDB
**And** a unique image ID is generated

#### Scenario: Generate and store thumbnail
**Given** an image is being saved
**When** the image is processed
**Then** a thumbnail is generated (max 200x200 pixels)
**And** the thumbnail uses JPEG format with 70% quality
**And** the thumbnail is stored in the same image record
**And** the thumbnail loads quickly in list views

#### Scenario: Image isolation from card data
**Given** images and card data are both stored
**When** the storage structure is examined
**Then** images are in a separate 'images' object store
**And** cards reference images by ID
**And** this separation improves query performance for card lists

### Requirement: Retrieve Card Data
The application MUST efficiently retrieve stored cards and images.

#### Scenario: Load all cards
**Given** the user opens the card list view
**When** the view initializes
**Then** all card records are loaded from IndexedDB
**And** cards are sorted by timestamp (newest first)
**And** thumbnails are loaded separately for performance

#### Scenario: Load specific card
**Given** the user wants to view or edit a specific card
**When** they select the card
**Then** the full card data is retrieved by ID
**And** the associated full-size image is loaded
**And** the data is displayed in the appropriate view

#### Scenario: Lazy load images
**Given** a list of many cards is displayed
**When** the user scrolls through the list
**Then** only visible card thumbnails are loaded
**And** images outside the viewport are loaded on-demand
**And** this improves initial page load performance

### Requirement: Update Card Data
The application MUST allow users to edit and update stored card information.

#### Scenario: Edit card fields
**Given** the user is viewing a card
**When** they click "Edit"
**Then** an editable form is displayed with current values
**And** all fields can be modified
**And** the rawOcr field remains read-only

#### Scenario: Save edited card
**Given** the user has modified card fields
**When** they click "Save"
**Then** the card record is updated in IndexedDB
**And** the lastModified timestamp is updated to current time
**And** the original timestamp remains unchanged
**And** a success message is shown

#### Scenario: Cancel editing
**Given** the user is editing a card
**When** they click "Cancel"
**Then** changes are discarded
**And** the original data is preserved
**And** the view returns to read-only mode

#### Scenario: Validation on save
**Given** the user is editing a card
**When** they attempt to save with invalid data (e.g., malformed email)
**Then** validation errors are shown
**And** the save is prevented
**And** the user can correct the errors

### Requirement: Delete Card Data
The application MUST allow users to delete unwanted cards.

#### Scenario: Delete single card
**Given** the user selects a card
**When** they click "Delete" and confirm
**Then** the card record is removed from IndexedDB
**And** the associated image is also deleted
**And** the card is removed from the display
**And** a success message is shown

#### Scenario: Confirm before deletion
**Given** the user clicks "Delete" on a card
**When** the delete action is triggered
**Then** a confirmation dialog appears
**And** the dialog warns that deletion is permanent
**And** the user must confirm to proceed

#### Scenario: Cascade delete images
**Given** a card is deleted
**When** the deletion occurs
**Then** the associated full-size image is deleted from IndexedDB
**And** the associated thumbnail is also deleted
**And** no orphaned images remain in storage

### Requirement: Storage Quota Management
The application MUST handle storage quota limits gracefully.

#### Scenario: Check storage availability
**Given** the user attempts to save a new card
**When** the save operation begins
**Then** available storage is checked
**And** if quota is nearly exceeded, a warning is shown

#### Scenario: Handle quota exceeded
**Given** IndexedDB storage quota is exceeded
**When** the user tries to save a new card
**Then** an error message is displayed
**And** the message suggests deleting old cards
**And** the user can view storage usage statistics
**And** the save operation fails gracefully

#### Scenario: Display storage usage
**Given** the user is in the card management view
**When** they check settings or storage info
**Then** current storage usage is displayed
**And** total available storage is shown
**And** usage is broken down by cards vs. images

### Requirement: Data Export
The application MUST allow users to export their card data.

#### Scenario: Export all cards as JSON
**Given** the user has multiple saved cards
**When** they click "Export All"
**Then** all card data is serialized to JSON format
**And** the JSON includes all fields except image blobs
**And** image IDs are included for reference

#### Scenario: Export selected cards
**Given** the user has selected specific cards
**When** they choose "Export Selected"
**Then** only the selected cards are exported
**And** the exported JSON follows the same structure

#### Scenario: Download exported data
**Given** card data has been exported to JSON
**When** the user chooses "Download"
**Then** a JSON file is downloaded
**And** the filename includes a timestamp (e.g., "business-cards-2025-01-15.json")
**And** the file is properly formatted and readable

#### Scenario: Copy to clipboard
**Given** card data has been exported to JSON
**When** the user chooses "Copy to Clipboard"
**Then** the JSON string is copied to the system clipboard
**And** a success message confirms the copy
**And** the user can paste the data elsewhere

### Requirement: Pinia Store Integration
The application MUST use a Pinia store for business card state management.

#### Scenario: Store initialization
**Given** the application loads
**When** the business card scanner is accessed
**Then** a Pinia store for business cards is created
**And** the store loads initial data from IndexedDB
**And** the store provides reactive state to components

#### Scenario: Reactive card list
**Given** the card list is displayed
**When** a card is added, updated, or deleted
**Then** the Pinia store is updated
**And** all components observing the store react to changes
**And** the UI updates automatically

#### Scenario: Error handling in store
**Given** a store action is executed
**When** an error occurs (e.g., IndexedDB failure)
**Then** the error is captured in the store's error state
**And** components can display the error to users
**And** the application remains stable

### Requirement: Data Timestamp Tracking
The application MUST track when cards are created and modified.

#### Scenario: Record scan timestamp
**Given** a card is scanned and saved
**When** the card record is created
**Then** the current timestamp is stored in the 'timestamp' field
**And** the timestamp uses Unix format (milliseconds since epoch)

#### Scenario: Record modification timestamp
**Given** a card is edited
**When** changes are saved
**Then** the 'lastModified' timestamp is updated
**And** the original 'timestamp' remains unchanged
**And** users can see when the card was last edited

#### Scenario: Display timestamps in UI
**Given** a card is displayed
**When** the user views card details
**Then** the scan date/time is shown in a readable format
**And** the last modified date/time is shown if different from scan time
**And** timestamps respect the user's locale (English/Chinese)

## MODIFIED Requirements
None - this is a new capability.

## REMOVED Requirements
None - this is a new capability.