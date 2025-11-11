# Design: Business Card Scanner Architecture

## System Architecture

### Component Structure
```
BusinessCardScannerView.vue (Main View)
├── CameraCapture.vue (Camera/Upload Interface)
├── OcrProcessor.vue (OCR Processing Logic)
├── CardForm.vue (Editable Card Data Form)
├── CardList.vue (List of Scanned Cards)
│   └── CardListItem.vue (Individual Card Display)
├── ImageViewer.vue (Full-size Image Modal)
└── ExportDialog.vue (Export Options)
```

### Data Flow
```
User Action → Camera/Upload → Image Capture
    ↓
Image → Tesseract.js → Raw OCR Text
    ↓
Raw Text → Field Parser → Structured Data
    ↓
Structured Data + Image → IndexedDB Storage
    ↓
Stored Data → Card List Display
    ↓
User Edits → Update IndexedDB
    ↓
Export Action → JSON Download/Clipboard
```

## Technology Choices

### OCR Engine: Tesseract.js
**Decision**: Start with Tesseract.js, design for future extensibility

**Rationale**:
- ✅ **Free and Open Source**: No API costs or keys required
- ✅ **Browser-based**: Works entirely offline, no network dependency
- ✅ **Multi-language Support**: Supports English and Chinese recognition
- ✅ **Active Development**: Well-maintained library with good documentation
- ⚠️ **Moderate Accuracy**: ~70-80% accuracy for printed text
- ⚠️ **Performance**: Can take 3-5 seconds per image

**Extensibility Design**:
```typescript
// OCR Service Interface - allows swapping implementations
interface OcrService {
  recognize(image: Blob): Promise<OcrResult>
}

// Tesseract Implementation
class TesseractOcrService implements OcrService {
  async recognize(image: Blob): Promise<OcrResult> { /* ... */ }
}

// Future: Google Vision API Implementation
class GoogleVisionOcrService implements OcrService {
  async recognize(image: Blob): Promise<OcrResult> { /* ... */ }
}
```

**Alternatives Considered**:
1. **Google Cloud Vision API**
   - ❌ Requires API key and network connection
   - ❌ Usage costs after free tier
   - ✅ Higher accuracy (90%+)
   - **Verdict**: Good future enhancement

2. **OCR.space API**
   - ❌ Requires network connection
   - ❌ Rate limits on free tier
   - ✅ Free tier available
   - **Verdict**: Possible fallback option

### Storage: IndexedDB
**Decision**: Use IndexedDB for both card data and images

**Rationale**:
- ✅ **Large Storage Capacity**: 50MB+ vs. LocalStorage's 5-10MB
- ✅ **Binary Storage**: Can store images as Blobs directly
- ✅ **Asynchronous API**: Non-blocking operations
- ✅ **Structured Data**: Query and index capabilities
- ⚠️ **More Complex API**: Requires abstraction layer

**Storage Schema**:
```typescript
// Business Card Store
interface BusinessCard {
  id: string                 // UUID
  timestamp: number          // Unix timestamp
  imageId: string           // Reference to image in separate store
  data: {
    name?: string
    title?: string
    company?: string
    phone?: string
    email?: string
    address?: string
    website?: string
    socialMedia?: string
    fax?: string
  }
  rawOcr: string            // Original OCR text
  lastModified: number      // Unix timestamp
}

// Image Store (separate for efficiency)
interface CardImage {
  id: string                // UUID
  image: Blob              // Compressed image
  thumbnail: Blob          // Small preview (max 200x200)
}
```

**IndexedDB Wrapper**:
Use a lightweight wrapper (e.g., `idb` library) to simplify API:
```typescript
import { openDB, DBSchema } from 'idb'

interface CardScannerDB extends DBSchema {
  cards: {
    key: string
    value: BusinessCard
    indexes: { 'by-timestamp': number }
  }
  images: {
    key: string
    value: CardImage
  }
}
```

**Alternatives Considered**:
1. **LocalStorage + Base64 Images**
   - ❌ 5-10MB limit (only ~5-10 cards with images)
   - ❌ Synchronous API blocks UI
   - ❌ No structured querying
   - **Verdict**: Too limited

2. **Dexie.js (IndexedDB wrapper)**
   - ✅ Simpler API than raw IndexedDB
   - ⚠️ Additional dependency
   - **Verdict**: Good option, but `idb` is lighter

### Image Processing

**Compression Strategy**:
- **Original Images**: Compress to JPEG with 80% quality, max 1920x1080
- **Thumbnails**: Resize to max 200x200, JPEG 70% quality
- **Use Case**: Balance quality with storage efficiency

**Implementation**:
```typescript
async function compressImage(file: File): Promise<{
  compressed: Blob
  thumbnail: Blob
}> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = await createImageBitmap(file)

  // Compress main image
  const scale = Math.min(1, 1920 / img.width, 1080 / img.height)
  canvas.width = img.width * scale
  canvas.height = img.height * scale
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const compressed = await canvasToBlob(canvas, 'image/jpeg', 0.8)

  // Create thumbnail
  const thumbScale = Math.min(200 / img.width, 200 / img.height)
  canvas.width = img.width * thumbScale
  canvas.height = img.height * thumbScale
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const thumbnail = await canvasToBlob(canvas, 'image/jpeg', 0.7)

  return { compressed, thumbnail }
}
```

### Field Extraction Strategy

**Approach**: Rule-based text parsing with regex patterns

**Field Detection Rules**:
```typescript
const FIELD_PATTERNS = {
  email: /[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,
  url: /https?:\/\/[\w.-]+\.[\w]{2,}(\/\S*)?/g,

  // Social media patterns
  linkedin: /linkedin\.com\/in\/[\w-]+/i,
  // ... more patterns
}

function extractFields(ocrText: string): Partial<BusinessCard['data']> {
  const lines = ocrText.split('\n').filter(l => l.trim())

  // Extract structured fields
  const email = ocrText.match(FIELD_PATTERNS.email)?.[0]
  const phone = ocrText.match(FIELD_PATTERNS.phone)?.[0]
  const website = ocrText.match(FIELD_PATTERNS.url)?.[0]

  // Heuristic: First non-empty line often contains name
  const name = lines[0]?.trim()

  // Second line often contains title
  const title = lines[1]?.trim()

  // ... more heuristics

  return { name, title, email, phone, website }
}
```

**Rationale**:
- ✅ **Simple and Fast**: No ML model required
- ✅ **Transparent**: Easy to debug and improve
- ⚠️ **Limited Accuracy**: Heuristics may fail on non-standard layouts
- **Future Enhancement**: Could add ML-based field detection

## UI/UX Design

### View Layout
```
┌─────────────────────────────────────────┐
│  Business Card Scanner                   │
│  [Camera Button] [Upload Button]        │
├─────────────────────────────────────────┤
│                                          │
│  [Camera Preview / Upload Area]         │
│                                          │
│  Status: Ready to scan...                │
│                                          │
├─────────────────────────────────────────┤
│  Recent Scans (3)                        │
│  ┌──────┬──────┬──────┐                │
│  │ [📷] │ [📷] │ [📷] │                │
│  │ Name │ Name │ Name │                │
│  └──────┴──────┴──────┘                │
│                                          │
│  [View All Cards] [Export All]          │
└─────────────────────────────────────────┘
```

### Card List View
```
┌─────────────────────────────────────────┐
│  Scanned Cards (24)                      │
│  [← Back] [Export All] [Delete All]     │
├─────────────────────────────────────────┤
│  ┌────────────────────────────────────┐ │
│  │ [📷] John Doe                       │ │
│  │      Senior Developer               │ │
│  │      ABC Company                    │ │
│  │      [View] [Edit] [Delete]        │ │
│  │      Scanned: 2025-01-15 10:30 AM  │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ [📷] Jane Smith                     │ │
│  │      ...                            │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Component Responsibilities

**BusinessCardScannerView.vue** (Main Container)
- Route-level component at `/business-card-scanner`
- Orchestrates child components
- Manages overall state and navigation
- Handles bilingual content via i18n

**CameraCapture.vue**
- Access device camera via MediaDevices API
- Display live camera preview
- Capture still image on button click
- Fallback to file upload input
- Emit captured image to parent

**OcrProcessor.vue** (Composition Logic)
- Load Tesseract.js worker
- Process image with OCR
- Parse raw text into structured fields
- Show processing progress
- Handle errors gracefully

**CardForm.vue**
- Display/edit card data fields
- Form validation
- Save changes to IndexedDB
- Cancel/discard changes

**CardList.vue**
- Display all scanned cards
- Filter/search functionality
- Sort by date
- Pagination for large lists

**CardListItem.vue**
- Show card thumbnail and preview data
- Click to view full image
- Quick actions: Edit, Delete
- Display scan timestamp

**ImageViewer.vue**
- Modal dialog with full-size image
- Zoom in/out controls
- Close on backdrop click
- Accessible (keyboard ESC to close)

**ExportDialog.vue**
- Choose export format (JSON)
- Download as file
- Copy to clipboard
- Export selected or all cards

## State Management

### Pinia Store: `businessCardStore`

```typescript
import { defineStore } from 'pinia'

export const useBusinessCardStore = defineStore('businessCard', () => {
  const cards = ref<BusinessCard[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load all cards from IndexedDB
  async function loadCards() {
    isLoading.value = true
    try {
      cards.value = await db.cards.getAll()
      cards.value.sort((a, b) => b.timestamp - a.timestamp)
    } catch (e) {
      error.value = 'Failed to load cards'
    } finally {
      isLoading.value = false
    }
  }

  // Add new card
  async function addCard(card: BusinessCard, image: Blob) {
    const { compressed, thumbnail } = await compressImage(image)
    const imageId = generateId()

    await db.images.add({ id: imageId, image: compressed, thumbnail })
    await db.cards.add({ ...card, imageId })

    await loadCards()
  }

  // Update card data
  async function updateCard(id: string, data: Partial<BusinessCard['data']>) {
    await db.cards.update(id, { data, lastModified: Date.now() })
    await loadCards()
  }

  // Delete card and its image
  async function deleteCard(id: string) {
    const card = await db.cards.get(id)
    if (card) {
      await db.images.delete(card.imageId)
      await db.cards.delete(id)
      await loadCards()
    }
  }

  // Export all cards as JSON
  function exportToJson(): string {
    return JSON.stringify(cards.value, null, 2)
  }

  return {
    cards,
    isLoading,
    error,
    loadCards,
    addCard,
    updateCard,
    deleteCard,
    exportToJson,
  }
})
```

## Internationalization

Add translations to `src/locales/en.json` and `src/locales/zh.json`:

```json
{
  "businessCardScanner": {
    "title": "Business Card Scanner",
    "subtitle": "Scan and manage business cards",
    "camera": "Open Camera",
    "upload": "Upload Image",
    "scanning": "Processing...",
    "scanSuccess": "Card scanned successfully!",
    "scanError": "Failed to scan card",
    "fields": {
      "name": "Name",
      "title": "Title",
      "company": "Company",
      "phone": "Phone",
      "email": "Email",
      "address": "Address",
      "website": "Website",
      "socialMedia": "Social Media",
      "fax": "Fax"
    },
    "actions": {
      "save": "Save",
      "edit": "Edit",
      "delete": "Delete",
      "cancel": "Cancel",
      "export": "Export",
      "viewImage": "View Image"
    }
  }
}
```

## Security Considerations

1. **Camera Permissions**: Request permission gracefully, explain why needed
2. **Data Privacy**: All data stays local, no network transmission
3. **Input Validation**: Sanitize OCR text before rendering (XSS prevention)
4. **Storage Quota**: Handle quota exceeded errors gracefully
5. **Image Content**: No automatic upload of sensitive images

## Performance Optimizations

1. **Lazy Loading**: Load Tesseract.js worker only when needed
2. **Image Compression**: Reduce storage and rendering time
3. **Virtual Scrolling**: For large card lists (>100 cards)
4. **Debounced Search**: For card filtering
5. **IndexedDB Indexing**: Index by timestamp for sorted queries
6. **Thumbnail Caching**: Use thumbnails in list view, full image only on demand

## Accessibility

- **Keyboard Navigation**: All actions accessible via keyboard
- **Screen Reader Support**: ARIA labels for all interactive elements
- **Focus Management**: Trap focus in modals, restore on close
- **Color Contrast**: Meet WCAG AA standards
- **Alternative Text**: Describe card images for screen readers
- **Error Messages**: Clear, actionable error descriptions

## Testing Strategy

### Unit Tests
- OCR text parsing logic
- Field extraction regex patterns
- Image compression utilities
- Store actions (mocked IndexedDB)

### Component Tests
- Camera capture component
- Card form validation
- Card list rendering
- Export functionality

### E2E Tests
- Complete scan workflow (mocked camera)
- Edit and save card
- Delete card
- Export cards as JSON
- Image viewer interaction

## Migration Path

**Phase 1**: Basic OCR with Tesseract.js
- Camera capture and upload
- Basic field extraction
- IndexedDB storage
- Simple card list

**Phase 2**: Enhanced Features
- Better field parsing (ML-based?)
- Improved UI/UX
- Advanced search/filter
- Batch operations

**Phase 3**: Optional Enhancements
- Google Vision API integration (user choice)
- VCard import/export
- Cloud backup option
- Contact synchronization

## Open Questions

1. **Should we support batch scanning** (multiple cards in sequence)?
   - **Recommendation**: Yes, but implement in Phase 2

2. **Should we allow duplicate detection**?
   - **Recommendation**: Nice-to-have, not critical for v1

3. **What happens when storage quota is exceeded**?
   - **Recommendation**: Show warning, allow user to delete old cards

4. **Should we compress images more aggressively**?
   - **Recommendation**: Start conservative (80% quality), adjust based on feedback