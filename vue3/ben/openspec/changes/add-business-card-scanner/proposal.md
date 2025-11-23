# Proposal: Add Business Card Scanner Tool

## Overview
Add a new standalone tool page for business card OCR (Optical Character Recognition) scanning and management. This tool allows users to capture business cards using their device camera or upload images, extract contact information using OCR, store the results locally, and manage their scanned cards.

添加一個新的獨立工具頁面，用於名片 OCR（光學字符識別）掃描和管理。此工具允許用戶使用設備相機拍攝名片或上傳圖片，使用 OCR 提取聯絡資訊，在本地儲存結果，並管理已掃描的名片。

## Goals
1. **New Tool Page**: Create `/business-card-scanner` route and view, following the existing pattern established by `/mrt-fare-finder`
   - 建立 `/business-card-scanner` 路由和視圖，遵循現有的 `/mrt-fare-finder` 模式

2. **OCR Capture**: Enable camera access and image upload for business card scanning
   - 啟用相機存取和圖片上傳功能進行名片掃描

3. **Contact Extraction**: Extract structured contact information from business cards using Tesseract.js
   - 使用 Tesseract.js 從名片中提取結構化的聯絡資訊

4. **Local Storage**: Store scanned cards with images in browser IndexedDB for offline access
   - 將掃描的名片及圖片儲存在瀏覽器 IndexedDB 中以供離線存取

5. **Card Management**: Provide interface to view, edit, and delete scanned cards
   - 提供介面以查看、編輯和刪除掃描的名片

6. **Export Functionality**: Allow users to export card data as JSON or copy to clipboard
   - 允許用戶將名片資料匯出為 JSON 或複製到剪貼簿

## Motivation
This tool serves as a practical utility within the personal tools collection, demonstrating:
- Modern web capabilities (Camera API, IndexedDB, OCR)
- Complex state management and data persistence
- Real-world problem-solving (digitizing business cards)
- Integration with existing tools ecosystem

此工具作為個人工具集中的實用工具，展示：
- 現代網頁功能（相機 API、IndexedDB、OCR）
- 複雜的狀態管理和資料持久化
- 解決實際問題（名片數位化）
- 與現有工具生態系統的整合

## Scope
### In Scope
- New route and view component for business card scanner
- **Dual camera capture methods**:
  - HTML5 `<input capture="environment">` for simple mobile camera access
  - `getUserMedia()` API for advanced camera features (live preview, flash control, focus)
- **Tabbed interface**: Separate tabs for "Camera" and "Upload" modes
- Image upload functionality with drag-and-drop support
- OCR integration using Tesseract.js with extensible architecture
- Structured data extraction for contact fields:
  - Name (姓名)
  - Title/Position (職稱)
  - Company (公司)
  - Phone (電話)
  - Email (電子郵件)
  - Address (地址)
  - Website/URL (網站)
  - Social Media (社群媒體)
  - Fax (傳真)
  - Raw OCR text with layout preservation (原始 OCR 文字，保留排版)
- IndexedDB storage for cards and images
- Card list display with thumbnail preview
- Full-size image viewer
- Card editing and deletion
- Export to JSON (download or clipboard)
- Timestamp tracking for each scan
- Bilingual UI (English/Chinese)
- Responsive design for mobile and desktop
- **Raw OCR text visualization**:
  - Monospace font display with preserved whitespace (`white-space: pre-wrap`)
  - ASCII-like layout representation of business card arrangement
  - Visual debugging aid for identifying OCR errors and image rotation issues
- **Region-based OCR optimization**:
  - Multi-region OCR processing for improved accuracy
  - Manual region selection for re-scanning specific areas
  - Automatic retry with different cropping strategies for low-confidence results
  - Region detection and intelligent result merging
- **Mobile-first features**:
  - Auto-focus control for sharp card images
  - Flash/torch control for low-light environments
  - Image rotation and cropping tools
  - Touch gestures for zoom and pan
  - Orientation detection and auto-rotation
- **Progressive Web App (PWA) capabilities**:
  - Service worker for offline functionality
  - App manifest for "Add to Home Screen"
  - Install prompts and standalone mode
  - Offline OCR processing
  - App icons and splash screens

### Out of Scope
- Cloud synchronization
- QR code scanning
- VCard import/export
- Contact sharing via email/SMS
- Advanced OCR training or custom models
- Multi-language OCR (initially focus on English/Chinese)
- Automatic contact categorization or tagging
- Integration with external contact management systems

## Constraints
- **Pure Frontend**: No backend required, all processing happens in browser
- **Browser Compatibility**: Requires modern browsers with Camera API, IndexedDB, and Service Worker support
- **HTTPS Requirement**: `getUserMedia()` API requires HTTPS (except for localhost development)
- **Storage Limits**: IndexedDB typically allows 50MB+ per origin, but recommend image compression
- **OCR Accuracy**: Tesseract.js has moderate accuracy; users may need to edit results
- **Performance**: OCR processing can take several seconds per image, especially on mobile devices
- **Privacy**: All data stays local in user's browser, no data transmitted to servers
- **PWA Limitations**: Some browsers (e.g., iOS Safari) have limited PWA support

## Risks
1. **OCR Accuracy**: Tesseract.js may not accurately extract all fields
   - **Mitigation**: Provide easy editing interface, store raw OCR text with layout preservation for visual error detection and debugging

2. **Performance**: Large images or many cards could slow down the app
   - **Mitigation**: Compress images before storage, lazy load thumbnails

3. **Browser Storage Limits**: Users might hit IndexedDB quotas
   - **Mitigation**: Show storage usage, allow users to delete old cards

4. **Camera Access**: Some devices/browsers may not support camera API
   - **Mitigation**: Always provide file upload as fallback, dual camera implementation (HTML5 + getUserMedia)

5. **HTTPS Deployment**: Advanced camera features require HTTPS
   - **Mitigation**: Deploy to HTTPS-enabled hosting (GitHub Pages supports HTTPS), provide fallback to simple capture

6. **PWA Adoption**: Users may not understand "Add to Home Screen" prompts
   - **Mitigation**: Clear instructions, dismissible prompts, works fine as regular web app too

7. **Mobile Performance**: OCR processing may be slower on mobile devices
   - **Mitigation**: Show clear progress indicators, optimize image size, consider Web Workers

## Related Work
- Existing tool pattern: `/mrt-fare-finder` (MrtFareFinderView.vue)
- Tools home page: `/` (ToolsHomeView.vue)
- Navigation system: NavBar component
- UI components: shadcn-vue component library
- State management: Pinia stores
- Internationalization: Vue i18n

## Success Metrics
- Users can successfully scan and store business cards
- OCR extraction works with reasonable accuracy (>70% field recognition)
- Card management (edit, delete, export) functions properly
- App remains responsive even with 50+ stored cards
- No data loss on browser refresh or navigation

## Why
This business card scanner tool addresses the practical need to digitize physical business cards, a common pain point for professionals who collect many cards at networking events and conferences. By leveraging modern web capabilities (Camera API, OCR, IndexedDB), the tool provides a serverless, privacy-focused solution that keeps all data local while offering advanced features like mobile camera controls, offline access via PWA, and structured contact extraction. The lazy camera initialization approach improves user experience by reducing intrusive permission requests and conserving battery until the camera is actually needed for capture.
