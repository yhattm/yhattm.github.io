# card-list-display Specification

## Purpose
Provides user interface for viewing, browsing, and interacting with saved business cards.

提供使用者介面以查看、瀏覽和互動已儲存的名片。

## ADDED Requirements

### Requirement: Card List View
The application MUST display all saved business cards in a list format.

#### Scenario: Display card list
**Given** the user has saved business cards
**When** they navigate to the card list view
**Then** all saved cards are displayed
**And** cards are ordered by scan timestamp (newest first)
**And** each card shows a preview of key information

#### Scenario: Empty state
**Given** the user has no saved cards
**When** they view the card list
**Then** an empty state message is displayed
**And** the message encourages them to scan their first card
**And** a button to start scanning is prominently displayed

#### Scenario: Card count indicator
**Given** the user is viewing the card list
**When** they look at the page header
**Then** the total number of saved cards is displayed
**And** the count updates automatically when cards are added or removed

### Requirement: Card List Items
Each card in the list MUST show preview information and thumbnail.

#### Scenario: Card preview content
**Given** a card is displayed in the list
**When** the user views the card item
**Then** they see the following information:
  - Card thumbnail image
  - Name (if available)
  - Title (if available)
  - Company (if available)
  - Scan timestamp
**And** missing fields are handled gracefully (shown as empty or "N/A")

#### Scenario: Thumbnail display
**Given** a card has an associated image
**When** the card is displayed in the list
**Then** a small thumbnail (max 200x200) is shown
**And** the thumbnail loads efficiently
**And** a placeholder is shown while loading
**And** aspect ratio is preserved

#### Scenario: Thumbnail fallback
**Given** a card's thumbnail fails to load
**When** the card is displayed
**Then** a placeholder icon is shown instead
**And** the rest of the card information is still visible

### Requirement: Card Actions
Users MUST be able to perform actions on individual cards from the list.

#### Scenario: View card details
**Given** a card is displayed in the list
**When** the user clicks on the card
**Then** the full card details are displayed
**And** all extracted fields are shown
**And** the full-size image is available

#### Scenario: Quick edit action
**Given** a card is displayed in the list
**When** the user clicks an "Edit" button
**Then** the card opens in edit mode
**And** all fields become editable
**And** save/cancel options are presented

#### Scenario: Quick delete action
**Given** a card is displayed in the list
**When** the user clicks a "Delete" button
**Then** a confirmation dialog appears
**And** upon confirmation, the card is deleted
**And** the list updates to remove the deleted card

### Requirement: Full-Size Image Viewer
The application MUST provide a modal viewer for full-size card images.

#### Scenario: Open image viewer
**Given** the user is viewing a card
**When** they click on the thumbnail or a "View Image" button
**Then** a modal opens displaying the full-size image
**And** the image is centered and properly sized
**And** the modal overlays the rest of the interface

#### Scenario: Image zoom controls
**Given** the image viewer is open
**When** the user interacts with zoom controls
**Then** they can zoom in to see details
**And** they can zoom out to see the whole image
**And** they can reset to original size

#### Scenario: Close image viewer
**Given** the image viewer is open
**When** the user clicks outside the image or presses ESC key or clicks close button
**Then** the modal closes
**And** they return to the previous view
**And** focus is restored appropriately

#### Scenario: Keyboard navigation in viewer
**Given** the image viewer is open
**When** the user presses keyboard keys
**Then** ESC closes the viewer
**And** arrow keys can navigate between images (if multiple cards)
**And** +/- keys can zoom in/out

### Requirement: Search and Filter
The application MUST allow users to search and filter their cards.

#### Scenario: Search by text
**Given** the user has many saved cards
**When** they type in a search box
**Then** the card list filters to show only matching cards
**And** matching is case-insensitive
**And** matching checks name, company, email, phone, and other text fields
**And** the list updates as they type

#### Scenario: Clear search
**Given** a search filter is active
**When** the user clears the search box
**Then** all cards are displayed again
**And** the list returns to the original sort order

#### Scenario: No search results
**Given** the user searches for a term
**When** no cards match the search
**Then** a "no results" message is displayed
**And** the message suggests trying different search terms
**And** an option to clear the search is provided

### Requirement: Sorting Options
The application MUST provide multiple sorting options for the card list.

#### Scenario: Sort by date (default)
**Given** the user is viewing the card list
**When** no custom sort is applied
**Then** cards are sorted by scan timestamp (newest first)

#### Scenario: Sort by name
**Given** the user selects "Sort by Name"
**When** the sort is applied
**Then** cards are sorted alphabetically by name
**And** cards without names appear at the end

#### Scenario: Sort by company
**Given** the user selects "Sort by Company"
**When** the sort is applied
**Then** cards are sorted alphabetically by company name
**And** cards without company names appear at the end

### Requirement: Responsive Card List
The card list MUST adapt to different screen sizes.

#### Scenario: Desktop layout
**Given** the user views the list on a desktop screen
**When** the page renders
**Then** cards are displayed in a multi-column grid (2-3 columns)
**And** thumbnails are larger for better visibility
**And** more information is shown per card

#### Scenario: Mobile layout
**Given** the user views the list on a mobile device
**When** the page renders
**Then** cards are displayed in a single column
**And** thumbnails are appropriately sized for mobile
**And** key information is still clearly visible
**And** touch targets are large enough for easy interaction

#### Scenario: Tablet layout
**Given** the user views the list on a tablet
**When** the page renders
**Then** cards are displayed in a 2-column grid
**And** the layout adapts smoothly between orientations

### Requirement: Performance for Large Lists
The application MUST handle large numbers of cards efficiently.

#### Scenario: Fast initial load
**Given** the user has 100+ saved cards
**When** they open the card list view
**Then** the initial page load is fast (<2 seconds)
**And** thumbnails load progressively
**And** the interface remains responsive

#### Scenario: Smooth scrolling
**Given** a long list of cards is displayed
**When** the user scrolls through the list
**Then** scrolling is smooth without lag
**And** images load as they come into view
**And** no jank or stuttering occurs

#### Scenario: Pagination or virtual scrolling (optional)
**Given** the user has 500+ cards
**When** viewing the list
**Then** only visible cards are rendered
**Or** pagination is used to limit rendered cards
**And** performance remains acceptable

### Requirement: Batch Operations
The application MUST support operations on multiple cards at once.

#### Scenario: Select multiple cards
**Given** the user is viewing the card list
**When** they enable multi-select mode
**Then** checkboxes appear on each card
**And** they can select multiple cards
**And** a count of selected cards is shown

#### Scenario: Delete multiple cards
**Given** multiple cards are selected
**When** the user clicks "Delete Selected"
**Then** a confirmation dialog shows the number of cards to delete
**And** upon confirmation, all selected cards are deleted
**And** the list updates to remove all deleted cards

#### Scenario: Export multiple cards
**Given** multiple cards are selected
**When** the user clicks "Export Selected"
**Then** only the selected cards are exported
**And** the export follows the same format as exporting all

### Requirement: Loading States
The application MUST show appropriate loading indicators.

#### Scenario: Loading card list
**Given** the card list is being loaded from IndexedDB
**When** the load is in progress
**Then** a loading spinner or skeleton UI is shown
**And** the user knows data is being fetched

#### Scenario: Loading thumbnail
**Given** a thumbnail is being loaded
**When** the image is loading
**Then** a placeholder or loading indicator is shown
**And** the space for the image is reserved to prevent layout shift

### Requirement: Error Handling
The application MUST gracefully handle errors in the card list view.

#### Scenario: Failed to load cards
**Given** IndexedDB fails to load cards
**When** the error occurs
**Then** an error message is displayed
**And** the user is informed about the issue
**And** options to retry or refresh are provided

#### Scenario: Failed to load image
**Given** a card image fails to load
**When** the error occurs
**Then** a placeholder icon is shown
**And** the rest of the card data is still accessible
**And** an error indicator is shown on the specific card

### Requirement: Accessibility
The card list MUST be accessible to all users.

#### Scenario: Keyboard navigation
**Given** the user navigates with keyboard only
**When** they use the card list
**Then** they can tab through all interactive elements
**And** they can activate buttons with Enter or Space
**And** focus indicators are clearly visible

#### Scenario: Screen reader support
**Given** a screen reader user accesses the card list
**When** they navigate through cards
**Then** each card's information is announced
**And** action buttons are properly labeled
**And** the current position in the list is announced

#### Scenario: Color contrast
**Given** the card list is displayed
**When** viewed in both light and dark themes
**Then** all text meets WCAG AA contrast requirements
**And** information is not conveyed by color alone

## MODIFIED Requirements
None - this is a new capability.

## REMOVED Requirements
None - this is a new capability.